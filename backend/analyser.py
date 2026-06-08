from collections import defaultdict
from datetime import datetime, timezone

from pymongo.errors import PyMongoError

from .database import packets_collection
from .alert_engine import check_alert

# Store packet statistics
packet_count = defaultdict(int)
byte_count = defaultdict(int)

total_packets = 0
total_bytes = 0


def process_ip(src_ip, packet_size):
    """
    Process incoming packet information
    """

    global total_packets
    global total_bytes

    # Update counters
    packet_count[src_ip] += 1
    byte_count[src_ip] += packet_size

    total_packets += 1
    total_bytes += packet_size

    # Check for traffic spike alerts
    check_alert(
        src_ip,
        packet_count[src_ip]
    )

    # Store packet information in MongoDB when available. Packet processing
    # should keep working even if the database is offline or TLS fails.
    try:
        packets_collection.insert_one({
            "ip": src_ip,
            "size": packet_size,
            "timestamp": datetime.now(timezone.utc)
        })
    except PyMongoError as exc:
        print(f"Packet persistence skipped: {exc}")


def get_stats():
    """
    Return current network statistics
    """

    return {
        "total_packets": total_packets,
        "total_bytes": total_bytes,
        "active_ips": len(packet_count),
        "top_ips": dict(packet_count),
        "bytes_per_ip": dict(byte_count)
    }
