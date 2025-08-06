# Indonesia Expedition Webhook

A webhook integration service for Indonesian courier tracking systems.  
It provides real‑time status updates from local shipping providers, normalizes incoming data, and enables automated forwarding to internal systems or chat platforms.

## 🚀 Features
- Supports receiving webhook callbacks from major Indonesian couriers (e.g. JNE, J&T, SiCepat).
- Parses and translates carrier-specific payloads into a unified format.
- Forwards status updates to HTTP(s) endpoints.
- Modular architecture: easy to extend support for new couriers or notification channels.

## 🛠️ Stack
- Node.js + TypeScript
- Lightweight web server (Express or Cloudflare Workers)
