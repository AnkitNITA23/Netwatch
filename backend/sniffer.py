from scapy.all import conf, sniff
from collections import defaultdict
from datetime import datetime
from collections import deque
from .analyser import process_ip, packet_count

# History tracking: store up to 100 snapshots of stats
stats_history = deque(maxlen=100)

# Active alerts
active_alerts = []

# Whether sniffing was successfully enabled. If False, there was an
# environment limitation (missing WinPcap/Npcap or privilege) and
# sniffing is disabled to avoid repeated crashes.
sniffing_enabled = True

def take_stats_snapshot():
    """Capture a snapshot of current stats with timestamp."""
    if not packet_count:
        return None
    
    snapshot = {
        "timestamp": datetime.now().isoformat(),
        "total_packets": sum(packet_count.values()),
        "unique_sources": len(packet_count),
        "top_source": max(packet_count.items(), key=lambda x: x[1], default=(None, 0)),
        "counts": dict(packet_count)
    }
    stats_history.append(snapshot)
    return snapshot

def check_alerts():
    """Detect anomalies and generate alerts."""
    active_alerts.clear()
    
    if not packet_count:
        return
    
    total = sum(packet_count.values())
    unique = len(packet_count)
    
    # Alert: High traffic from single source (>50% of total)
    if unique > 0:
        max_ip, max_count = max(packet_count.items(), key=lambda x: x[1])
        if max_count > total * 0.5:
            active_alerts.append({
                "type": "high_single_source",
                "severity": "high",
                "message": f"High traffic from {max_ip}: {max_count} packets ({max_count*100//total}% of total)",
                "ip": max_ip,
                "count": max_count
            })
    
    # Alert: Unusual number of sources (>20 different IPs)
    if unique > 20:
        active_alerts.append({
            "type": "unusual_sources",
            "severity": "medium",
            "message": f"Unusual number of unique sources: {unique}",
            "count": unique
        })
    
    # Alert: Very high total packet count (>1000)
    if total > 1000:
        active_alerts.append({
            "type": "high_volume",
            "severity": "medium",
            "message": f"High volume traffic detected: {total} total packets",
            "count": total
        })

packet_counter = 0

def process_packet(packet):
    global packet_counter
    
    src = None
    if packet.haslayer("IP"):
        src = packet["IP"].src
        try:
            print(f"[sniffer] IPv4 packet from {src}")
        except Exception:
            pass
    elif packet.haslayer("IPv6"):
        src = packet["IPv6"].src
        try:
            print(f"[sniffer] IPv6 packet from {src}")
        except Exception:
            pass
            
    if src:
        process_ip(src, len(packet))
    
    # Every 50 packets, take a snapshot and check alerts
    packet_counter += 1
    if packet_counter % 50 == 0:
        take_stats_snapshot()
        check_alerts()

def start_sniffing():
    global sniffing_enabled

    # Decide which socket to pass to sniff(). If L2 (pcap) is unavailable,
    # attempt to use L3. If creating an L3 socket fails (requires admin or
    # Npcap), disable sniffing and exit gracefully.
    L2socket = None
    try:
        if getattr(conf.L2socket, "__name__", "") == "_NotAvailableSocket":
            # Try to probe L3 socket usability by instantiating one.
            if conf.L3socket is not None:
                try:
                    probe = conf.L3socket()
                    probe.close()
                    L2socket = conf.L3socket
                except OSError as osex:
                    print(f"Packet sniffing disabled: {osex}")
                    sniffing_enabled = False
                    return
            else:
                sniffing_enabled = False
                return
    except Exception:
        # Any unexpected issue with conf objects -> disable sniffing.
        sniffing_enabled = False
        return

    try:
        sniff(
            prn=process_packet,
            store=False,
            iface=conf.iface,
            L2socket=L2socket,
        )
    except Exception as exc:
        print(f"Packet sniffing failed: {exc}")
        sniffing_enabled = False
