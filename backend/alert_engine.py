alerts = []

TRAFFIC_THRESHOLD = 1000


def check_alert(ip, count):
    if count > TRAFFIC_THRESHOLD:
        # Check if an alert for this IP already exists and update it
        for alert in alerts:
            if alert.get("ip") == ip and alert.get("type") == "traffic_spike":
                alert["count"] = count
                alert["message"] = f"Traffic Spike: {ip} generated {count} packets (Threshold: {TRAFFIC_THRESHOLD})"
                return

        alert = {
            "type": "traffic_spike",
            "severity": "high",
            "message": f"Traffic Spike: {ip} generated {count} packets (Threshold: {TRAFFIC_THRESHOLD})",
            "ip": ip,
            "count": count
        }
        alerts.append(alert)


def get_alerts():
    return alerts