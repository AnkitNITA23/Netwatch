from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .sniffer import packet_count, sniffing_enabled, stats_history, active_alerts, take_stats_snapshot, check_alerts
from scapy.all import conf
import threading
import time
from datetime import datetime
from .sniffer import start_sniffing
from .analyser import get_stats
from .alert_engine import get_alerts
from contextlib import asynccontextmanager

def start_sniff_thread():
    threading.Thread(
        target=start_sniffing,
        daemon=True
    ).start()

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_sniff_thread()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "NetWatch Running"}

@app.get("/traffic")
def traffic():
    return packet_count


@app.get("/sniffer_status")
def sniffer_status():
    if sniffing_enabled:
        return {"sniffing": True, "message": "Packet sniffing enabled"}
    return {
        "sniffing": False,
        "message": "Packet sniffing disabled: requires running as administrator or installing Npcap",
    }


@app.get("/sniffer_info")
def sniffer_info():
    return {"sniffing_enabled": sniffing_enabled, "iface": str(conf.iface)}


@app.api_route("/simulate_traffic", methods=["GET", "POST"])
def simulate_traffic(ip: str):
    # Dev helper: increment the packet_count for an IP address for testing using process_ip
    from .analyser import process_ip
    process_ip(ip, 64) # simulate average 64 byte packet
    total = sum(packet_count.values())
    check_alerts()
    take_stats_snapshot()
    return {"ip": ip, "count": packet_count[ip], "total_packets": total}


@app.get("/stats")
def stats():
    """Return traffic statistics."""
    # Check for alerts on-demand
    check_alerts()
    
    # Fetch byte statistics from analyser
    analyser_stats = get_stats()
    total_bytes = analyser_stats["total_bytes"]
    bytes_per_ip = analyser_stats["bytes_per_ip"]
    
    # Merge sniffer alerts and alert_engine alerts
    combined_alerts = list(active_alerts)
    for alert in get_alerts():
        if alert not in combined_alerts:
            combined_alerts.append(alert)
    
    if not packet_count:
        return {
            "total_packets": 0,
            "unique_sources": 0,
            "total_bytes": 0,
            "bytes_per_ip": {},
            "details": "No traffic data available",
            "alerts": combined_alerts
        }
    
    total = sum(packet_count.values())
    unique = len(packet_count)
    avg_per_ip = total / unique if unique > 0 else 0
    
    # Top 5 sources
    top_sources = sorted(packet_count.items(), key=lambda x: x[1], reverse=True)[:5]
    
    return {
        "total_packets": total,
        "unique_sources": unique,
        "average_packets_per_source": round(avg_per_ip, 2),
        "top_sources": [{"ip": ip, "count": count} for ip, count in top_sources],
        "all_sources": dict(packet_count),
        "total_bytes": total_bytes,
        "bytes_per_ip": bytes_per_ip,
        "alerts": combined_alerts
    }


@app.get("/stats_history")
def stats_history_endpoint():
    """Return historical statistics snapshots."""
    return {
        "total_snapshots": len(stats_history),
        "history": list(stats_history)
    }


@app.get("/alerts")
def alerts():
    """Return current active alerts."""
    check_alerts()
    
    # Merge sniffer alerts and alert_engine alerts
    combined_alerts = list(active_alerts)
    for alert in get_alerts():
        if alert not in combined_alerts:
            combined_alerts.append(alert)
            
    return {
        "active_alerts": combined_alerts,
        "alert_count": len(combined_alerts)
    }


@app.get("/db_status")
def db_status():
    """Check MongoDB Atlas connection status."""
    try:
        from .database import client
        start = time.perf_counter()
        client.admin.command('ping')
        response_time = time.perf_counter() - start
        return {
            "status": "connected",
            "connected": True,
            "message": "Successfully connected to MongoDB Atlas",
            "database": "netwatch",
            "collection": "traffic",
            "response_time": response_time,
            "timestamp": datetime.now().isoformat(),
        }
    except Exception as e:
        return {
            "status": "disconnected",
            "connected": False,
            "message": f"MongoDB connection failed: {str(e)}",
            "error": type(e).__name__,
            "database": "netwatch",
            "collection": "traffic",
            "timestamp": datetime.now().isoformat(),
        }


@app.post("/save_traffic")
def save_traffic():
    """Save current traffic snapshot to MongoDB."""
    try:
        from .database import traffic_collection
        from datetime import datetime
        
        # Merge sniffer alerts and alert_engine alerts for snapshot saving
        combined_alerts = list(active_alerts)
        for alert in get_alerts():
            if alert not in combined_alerts:
                combined_alerts.append(alert)
                
        if not packet_count:
            return {"status": "empty", "message": "No traffic data to save"}
        
        doc = {
            "timestamp": datetime.now().isoformat(),
            "total_packets": sum(packet_count.values()),
            "unique_sources": len(packet_count),
            "traffic": dict(packet_count),
            "alerts": combined_alerts
        }
        
        result = traffic_collection.insert_one(doc)
        return {
            "status": "saved",
            "document_id": str(result.inserted_id),
            "records_count": traffic_collection.count_documents({})
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to save: {str(e)}",
            "error": type(e).__name__
        }


@app.get("/load_traffic")
def load_traffic(limit: int = 10):
    """Load recent traffic records from MongoDB."""
    try:
        from .database import traffic_collection
        
        records = list(
            traffic_collection.find({}, {"_id": 0})
            .sort("timestamp", -1)
            .limit(limit)
        )
        
        return {
            "status": "success",
            "records_count": len(records),
            "records": records
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to load: {str(e)}",
            "error": type(e).__name__
        }
