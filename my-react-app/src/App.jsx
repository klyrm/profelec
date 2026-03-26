import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  MapPin,
  Star,
  Wifi,
  CarFront,
  Coffee,
  Waves,
  Search,
  BedDouble,
  Users,
  ChevronRight,
  Sparkles,
  ShieldCheck,
  ChevronLeft,
} from "lucide-react";

const rooms = [
  {
    id: 1,
    name: "Deluxe Sea View",
    type: "Deluxe",
    price: 129,
    rating: 4.9,
    beds: "1 King Bed",
    guests: "2 Guests",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    features: ["Ocean View", "Breakfast", "Balcony"],
  },
  {
    id: 2,
    name: "Executive Suite",
    type: "Suite",
    price: 189,
    rating: 5.0,
    beds: "1 King Bed",
    guests: "3 Guests",
    image:
      "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80",
    features: ["Living Area", "Jacuzzi", "Private Lounge"],
  },
  {
    id: 3,
    name: "Classic Basic Room",
    type: "Basic",
    price: 79,
    rating: 4.7,
    beds: "2 Single Beds",
    guests: "2 Guests",
    image:
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
    features: ["Cozy Stay", "Free Wi‑Fi", "City View"],
  },
];

const amenities = [
  { icon: Wifi, label: "Free Wi‑Fi" },
  { icon: CarFront, label: "Parking" },
  { icon: Coffee, label: "Breakfast" },
  { icon: Waves, label: "Pool Access" },
];

const testimonials = [
  {
    name: "Andrea Cruz",
    text: "The booking experience was smooth, and the room design feels premium and relaxing.",
  },
  {
    name: "Miguel Santos",
    text: "Love the clean layout. It looks modern and makes it easy to choose a room fast.",
  },
  {
    name: "Nina Flores",
    text: "The UI feels elegant and trustworthy—perfect for a hotel booking app.",
  },
];

function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

function RoomCard({ room, selected, onSelect }) {
  return (
    <button
      onClick={() => onSelect(room)}
      className={cn("room-card", selected && "room-card-selected")}
    >
      <div className="room-card-media">
        <img src={room.image} alt={room.name} />
        <div className="room-card-overlay" />
        <div className="room-badge room-badge-type">{room.type}</div>
        <div className="room-badge room-badge-rating">
          <Star className="icon fill" /> {room.rating}
        </div>
        <div className="room-card-titlewrap">
          <div className="room-card-title">{room.name}</div>
          <div className="room-card-subtitle">{room.beds} • {room.guests}</div>
        </div>
      </div>

      <div className="room-card-body">
        <div className="feature-list">
          {room.features.map((feature) => (
            <span key={feature} className="feature-pill">
              {feature}
            </span>
          ))}
        </div>

        <div className="room-card-footer">
          <div>
            <div className="section-kicker">Starting from</div>
            <div className="price-line">
              ${room.price}
              <span> / night</span>
            </div>
          </div>
          <div className="card-arrow">
            <ChevronRight className="icon arrow-icon" />
          </div>
        </div>
      </div>
    </button>
  );
}

export default function App() {
  const [selectedRoom, setSelectedRoom] = useState(rooms[0]);
  const [guests, setGuests] = useState(2);
  const [roomType, setRoomType] = useState("All");

  const filteredRooms = useMemo(() => {
    if (roomType === "All") return rooms;
    return rooms.filter((room) => room.type === roomType);
  }, [roomType]);

  const nights = 3;
  const total = selectedRoom.price * nights;

  return (
    <div className="hotel-app">
      <style>{`
        :root {
          --bg: #f8fafc;
          --panel: rgba(255, 255, 255, 0.72);
          --panel-strong: rgba(255, 255, 255, 0.94);
          --text: #0f172a;
          --muted: #64748b;
          --line: rgba(148, 163, 184, 0.24);
          --shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
          --shadow-strong: 0 30px 90px rgba(15, 23, 42, 0.18);
          --primary: #0f172a;
          --accent: #38bdf8;
        }

        * {
          box-sizing: border-box;
        }

        html, body, #root {
          margin: 0;
          min-height: 100%;
          background: var(--bg);
        }

        body {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--text);
        }

        button, input {
          font: inherit;
        }

        img {
          display: block;
          width: 100%;
        }

        .hotel-app {
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(255,255,255,0.95), rgba(226,232,240,0.92), rgba(241,245,249,1));
          padding: 16px;
        }

        .page-shell {
          max-width: 1280px;
          margin: 0 auto;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.72);
          background: rgba(255,255,255,0.58);
          box-shadow: 0 30px 100px rgba(15,23,42,0.12);
          backdrop-filter: blur(24px);
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: 56px 28px;
          color: white;
          isolation: isolate;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          background: linear-gradient(135deg, rgba(15,23,42,0.96), rgba(30,41,59,0.90), rgba(56,189,248,0.28));
        }

        .hero-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(48px);
          z-index: -1;
          animation: floatUp 5.5s ease-in-out infinite;
        }

        .hero-glow.one {
          width: 280px;
          height: 280px;
          top: -72px;
          right: -52px;
          background: rgba(34,211,238,0.22);
        }

        .hero-glow.two {
          width: 320px;
          height: 320px;
          left: -90px;
          bottom: -80px;
          background: rgba(125,211,252,0.18);
        }

        .hero-grid {
          display: grid;
          gap: 40px;
          align-items: center;
        }

        @media (min-width: 1024px) {
          .hero-grid {
            grid-template-columns: 1.2fr 0.8fr;
          }
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(14px);
          font-size: 14px;
          margin-bottom: 18px;
          transition: transform 0.3s ease, background 0.3s ease;
          animation: fadeInUp 0.7s ease both;
        }

        .eyebrow:hover {
          transform: scale(1.04);
          background: rgba(255,255,255,0.14);
        }

        .eyebrow .icon {
          width: 16px;
          height: 16px;
          color: #67e8f9;
        }

        .hero h1 {
          margin: 0;
          max-width: 760px;
          font-size: clamp(2.4rem, 5vw, 4.4rem);
          line-height: 1.04;
          letter-spacing: -0.04em;
          animation: fadeInUp 0.8s ease both;
        }

        .hero p {
          max-width: 640px;
          margin: 16px 0 0;
          color: rgba(255,255,255,0.76);
          line-height: 1.8;
          animation: fadeInUp 0.9s ease both;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 28px;
          animation: fadeInUp 1s ease both;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          border: 0;
          border-radius: 18px;
          padding: 14px 18px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease, color 0.3s ease;
          text-decoration: none;
        }

        .btn:hover {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.14);
        }

        .btn:active {
          transform: scale(0.98);
        }

        .btn-primary {
          background: white;
          color: #0f172a;
          font-weight: 700;
        }

        .btn-secondary {
          background: rgba(255,255,255,0.10);
          color: white;
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(14px);
          font-weight: 700;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 32px;
          max-width: 640px;
        }

        .stat {
          border-radius: 24px;
          padding: 18px;
          background: rgba(255,255,255,0.10);
          border: 1px solid rgba(255,255,255,0.15);
          backdrop-filter: blur(14px);
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .stat:hover {
          transform: translateY(-4px);
          background: rgba(255,255,255,0.14);
        }

        .stat-value {
          font-size: 1.6rem;
          font-weight: 700;
          line-height: 1.1;
        }

        .stat-label {
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.66);
        }

        .hero-preview {
          border-radius: 32px;
          padding: 18px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.15);
          box-shadow: 0 24px 70px rgba(15,23,42,0.26);
          backdrop-filter: blur(20px);
          animation: fadeInUp 0.85s ease both;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .hero-preview:hover {
          transform: translateY(-4px) scale(1.01);
          box-shadow: 0 34px 90px rgba(15,23,42,0.34);
        }

        .preview-head {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 14px;
        }

        .preview-head p {
          margin: 0;
          font-size: 14px;
          color: rgba(255,255,255,0.64);
        }

        .preview-head h2 {
          margin: 4px 0 0;
          font-size: 26px;
          line-height: 1.1;
        }

        .preview-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: rgba(255,255,255,0.10);
          transition: transform 0.3s ease;
        }

        .preview-icon:hover {
          transform: rotate(6deg) scale(1.08);
        }

        .preview-image {
          border-radius: 28px;
          overflow: hidden;
          height: 270px;
          background: rgba(255,255,255,0.08);
        }

        .preview-image img {
          height: 100%;
          object-fit: cover;
          transition: transform 0.75s ease;
        }

        .preview-image:hover img {
          transform: scale(1.09);
        }

        .preview-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 16px;
        }

        .mini-card {
          border-radius: 20px;
          padding: 16px;
          background: rgba(255,255,255,0.10);
          transition: transform 0.3s ease, background 0.3s ease;
        }

        .mini-card:hover {
          transform: translateY(-3px);
          background: rgba(255,255,255,0.15);
        }

        .mini-kicker {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.52);
        }

        .mini-value {
          margin-top: 6px;
          font-size: 18px;
          font-weight: 700;
        }

        .content {
          padding: 28px;
        }

        @media (min-width: 1024px) {
          .content {
            padding: 34px 56px 44px;
          }
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
          margin-bottom: 18px;
        }

        .section-header h2,
        .sidebar-title,
        .testimonial-name {
          margin: 0;
        }

        .muted {
          color: var(--muted);
        }

        .section-title {
          font-size: 28px;
          line-height: 1.1;
          letter-spacing: -0.03em;
        }

        .filters {
          display: flex;
          gap: 8px;
          padding: 6px;
          border-radius: 18px;
          background: #0f172a;
          box-shadow: 0 10px 30px rgba(15,23,42,0.18);
        }

        .filter-btn {
          border: 0;
          border-radius: 14px;
          padding: 10px 14px;
          cursor: pointer;
          background: transparent;
          color: rgba(255,255,255,0.78);
          font-weight: 600;
          transition: background 0.25s ease, transform 0.25s ease, color 0.25s ease;
        }

        .filter-btn:hover {
          transform: scale(1.04);
          color: #fff;
        }

        .filter-btn.active {
          background: white;
          color: #0f172a;
          box-shadow: 0 10px 24px rgba(0,0,0,0.10);
        }

        .room-grid {
          display: grid;
          gap: 22px;
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        @media (min-width: 768px) {
          .room-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }

        @media (min-width: 1280px) {
          .room-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        }

        .room-card {
          border: 1px solid rgba(255,255,255,0.72);
          border-radius: 28px;
          overflow: hidden;
          background: var(--panel);
          backdrop-filter: blur(18px);
          box-shadow: var(--shadow);
          cursor: pointer;
          text-align: left;
          padding: 0;
          transition: transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .room-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: var(--shadow-strong);
          border-color: rgba(15,23,42,0.14);
        }

        .room-card-selected {
          border-color: rgba(15,23,42,0.28);
          box-shadow: 0 24px 60px rgba(15,23,42,0.14);
        }

        .room-card-media {
          position: relative;
          height: 242px;
          overflow: hidden;
        }

        .room-card-media img {
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease;
        }

        .room-card:hover .room-card-media img {
          transform: scale(1.10);
        }

        .room-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15,23,42,0.76), rgba(15,23,42,0.10), transparent);
          transition: opacity 0.35s ease;
        }

        .room-card:hover .room-card-overlay {
          opacity: 0.96;
        }

        .room-badge {
          position: absolute;
          top: 16px;
          padding: 8px 12px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 700;
          backdrop-filter: blur(12px);
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .room-badge-type {
          left: 16px;
          background: rgba(255,255,255,0.92);
          color: #0f172a;
        }

        .room-badge-rating {
          right: 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(15,23,42,0.72);
          color: white;
        }

        .room-card:hover .room-badge {
          transform: translateY(-2px) scale(1.03);
        }

        .room-card-titlewrap {
          position: absolute;
          left: 16px;
          right: 16px;
          bottom: 16px;
          color: white;
          transition: transform 0.25s ease;
        }

        .room-card:hover .room-card-titlewrap {
          transform: translateY(-2px);
        }

        .room-card-title {
          font-size: 22px;
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: 6px;
        }

        .room-card-subtitle {
          color: rgba(255,255,255,0.82);
          font-size: 14px;
        }

        .room-card-body {
          padding: 18px;
        }

        .feature-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 18px;
        }

        .feature-pill {
          display: inline-flex;
          align-items: center;
          padding: 7px 12px;
          border-radius: 999px;
          background: #f1f5f9;
          color: #334155;
          font-size: 12px;
          font-weight: 600;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }

        .room-card:hover .feature-pill {
          background: #0f172a;
          color: white;
        }

        .feature-pill:hover {
          transform: translateY(-1px) scale(1.03);
        }

        .room-card-footer {
          display: flex;
          align-items: end;
          justify-content: space-between;
          gap: 12px;
        }

        .section-kicker {
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #64748b;
          margin-bottom: 6px;
        }

        .price-line {
          font-size: 32px;
          font-weight: 800;
          line-height: 1;
        }

        .price-line span {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
        }

        .card-arrow {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 16px;
          background: #f1f5f9;
          color: #334155;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }

        .room-card:hover .card-arrow {
          background: #0f172a;
          color: white;
          transform: translateX(2px);
        }

        .sidebar {
          display: grid;
          gap: 22px;
        }

        .panel {
          border-radius: 28px;
          background: var(--panel-strong);
          border: 1px solid rgba(148, 163, 184, 0.22);
          box-shadow: 0 20px 60px rgba(15,23,42,0.08);
          padding: 24px;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .panel:hover {
          transform: translateY(-4px);
          box-shadow: 0 30px 80px rgba(15,23,42,0.12);
        }

        .panel-header {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 12px;
        }

        .panel-header h3 {
          font-size: 28px;
          line-height: 1.1;
          margin-top: 6px;
        }

        .shield-box {
          width: 46px;
          height: 46px;
          border-radius: 16px;
          background: #0f172a;
          color: white;
          display: grid;
          place-items: center;
          transition: transform 0.3s ease;
        }

        .shield-box:hover {
          transform: rotate(6deg) scale(1.05);
        }

        .form-group {
          margin-top: 18px;
        }

        .label {
          display: block;
          margin-bottom: 10px;
          color: #475569;
          font-size: 14px;
          font-weight: 600;
        }

        .field {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          border-radius: 18px;
          background: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.24);
        }

        .field .icon {
          width: 18px;
          height: 18px;
          color: #64748b;
          flex: 0 0 auto;
        }

        .field input {
          width: 100%;
          border: 0;
          outline: none;
          background: transparent;
          color: #0f172a;
        }

        .field:hover,
        .field:focus-within {
          background: white;
          border-color: rgba(15, 23, 42, 0.20);
          box-shadow: 0 10px 24px rgba(15,23,42,0.06);
          transform: translateY(-1px);
        }

        .guest-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .guest-control {
          display: inline-flex;
          gap: 8px;
        }

        .guest-btn {
          width: 38px;
          height: 38px;
          border: 0;
          border-radius: 12px;
          background: white;
          color: #0f172a;
          display: grid;
          place-items: center;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(15,23,42,0.08);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        .guest-btn:hover {
          transform: translateY(-1px) scale(1.05);
          box-shadow: 0 10px 24px rgba(15,23,42,0.12);
        }

        .guest-btn.plus {
          background: #0f172a;
          color: white;
        }

        .booking-box {
          border-radius: 26px;
          padding: 20px;
          background: #0f172a;
          color: white;
          box-shadow: 0 20px 60px rgba(15,23,42,0.24);
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .booking-box:hover {
          transform: translateY(-4px);
          box-shadow: 0 28px 80px rgba(15,23,42,0.30);
        }

        .booking-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          color: rgba(255,255,255,0.70);
          font-size: 14px;
        }

        .booking-total {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 12px;
          margin-top: 14px;
        }

        .total-value {
          font-size: 34px;
          line-height: 1;
          font-weight: 800;
          margin-top: 6px;
        }

        .reserve-btn {
          border: 0;
          border-radius: 18px;
          background: white;
          color: #0f172a;
          font-weight: 800;
          padding: 14px 16px;
          cursor: pointer;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .reserve-btn:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 14px 30px rgba(255,255,255,0.16);
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .amenity {
          border-radius: 20px;
          background: #f8fafc;
          padding: 16px;
          transition: transform 0.3s ease, background 0.3s ease, box-shadow 0.3s ease;
        }

        .amenity:hover {
          transform: translateY(-3px);
          background: white;
          box-shadow: 0 12px 28px rgba(15,23,42,0.08);
        }

        .amenity .icon {
          width: 20px;
          height: 20px;
          color: #0f172a;
        }

        .amenity-label {
          margin-top: 12px;
          font-size: 14px;
          font-weight: 600;
          color: #334155;
        }

        .testimonials {
          padding: 0 28px 28px;
          display: grid;
          gap: 22px;
        }

        @media (min-width: 1024px) {
          .testimonials {
            padding: 0 56px 44px;
          }
        }

        .testimonials-grid {
          display: grid;
          gap: 18px;
        }

        @media (min-width: 1024px) {
          .testimonials-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .testimonial {
          border-radius: 26px;
          background: white;
          border: 1px solid rgba(148, 163, 184, 0.22);
          box-shadow: 0 20px 60px rgba(15,23,42,0.08);
          padding: 22px;
          transition: transform 0.35s ease, box-shadow 0.35s ease;
        }

        .testimonial:hover {
          transform: translateY(-4px);
          box-shadow: 0 28px 80px rgba(15,23,42,0.12);
        }

        .stars {
          display: flex;
          gap: 2px;
          color: #f59e0b;
        }

        .testimonial-text {
          margin: 16px 0 0;
          color: #475569;
          line-height: 1.85;
          font-size: 14px;
        }

        .testimonial-name {
          margin-top: 18px;
          font-weight: 700;
          color: #0f172a;
        }

        .icon {
          width: 18px;
          height: 18px;
        }

        .icon.fill {
          fill: currentColor;
        }

        .arrow-icon {
          transition: transform 0.3s ease;
        }

        .room-card:hover .arrow-icon {
          transform: translateX(2px);
        }

        @keyframes floatUp {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .hero,
          .content,
          .testimonials {
            padding-left: 18px;
            padding-right: 18px;
          }

          .section-title {
            font-size: 24px;
          }

          .filters {
            width: 100%;
            justify-content: space-between;
            overflow-x: auto;
          }

          .room-card-title {
            font-size: 20px;
          }

          .total-value {
            font-size: 28px;
          }
        }
      `}</style>

      <main className="page-shell">
        <section className="hero">
          <div className="hero-bg" />
          <div className="hero-glow one" />
          <div className="hero-glow two" />

          <div className="hero-grid">
            <div>
              <div className="eyebrow">
                <Sparkles className="icon" />
                Luxury Hotel Booking Experience
              </div>

              <h1>
                Book your perfect stay with a sleek, modern hotel interface.
              </h1>
              <p>
                Explore rooms, compare amenities, and reserve your ideal stay with a clean
                and elegant booking experience.
              </p>

              <div className="hero-actions">
                <button className="btn btn-primary">
                  <Search className="icon" />
                  Explore Rooms
                </button>
                <button className="btn btn-secondary">
                  <CalendarDays className="icon" />
                  Check Availability
                </button>
              </div>

              <div className="stats">
                <div className="stat">
                  <div className="stat-value">120+</div>
                  <div className="stat-label">Rooms</div>
                </div>
                <div className="stat">
                  <div className="stat-value">4.9/5</div>
                  <div className="stat-label">Guest Rating</div>
                </div>
                <div className="stat">
                  <div className="stat-value">24/7</div>
                  <div className="stat-label">Support</div>
                </div>
              </div>
            </div>

            <div className="hero-preview">
              <div className="preview-head">
                <div>
                  <p>Selected Room</p>
                  <h2>{selectedRoom.name}</h2>
                </div>
                <div className="preview-icon">
                  <BedDouble className="icon" />
                </div>
              </div>

              <div className="preview-image">
                <img src={selectedRoom.image} alt={selectedRoom.name} />
              </div>

              <div className="preview-grid">
                <div className="mini-card">
                  <div className="mini-kicker">Room Type</div>
                  <div className="mini-value">{selectedRoom.type}</div>
                </div>
                <div className="mini-card">
                  <div className="mini-kicker">Rate</div>
                  <div className="mini-value">${selectedRoom.price}/night</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="content">
          <div className="section-header">
            <div>
              <div className="muted">Choose your stay</div>
              <h2 className="section-title">Room options</h2>
            </div>

            <div className="filters">
              {["All", "Deluxe", "Suite", "Basic"].map((type) => (
                <button
                  key={type}
                  onClick={() => setRoomType(type)}
                  className={cn("filter-btn", roomType === type && "active")}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="hero-grid" style={{ alignItems: "start" }}>
            <div>
              <div className="room-grid">
                {filteredRooms.map((room, index) => (
                  <div key={room.id} style={{ animation: `fadeInUp 0.65s ease ${index * 120}ms both` }}>
                    <RoomCard
                      room={room}
                      selected={selectedRoom.id === room.id}
                      onSelect={setSelectedRoom}
                    />
                  </div>
                ))}
              </div>
            </div>

            <aside className="sidebar">
              <div className="panel">
                <div className="panel-header">
                  <div>
                    <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Book now</div>
                    <h3 className="sidebar-title">Reservation details</h3>
                  </div>
                  <div className="shield-box">
                    <ShieldCheck className="icon" />
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Destination</label>
                  <div className="field">
                    <MapPin className="icon" />
                    <input defaultValue="Baguio, Philippines" />
                  </div>
                </div>

                <div className="form-group" style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
                  <div>
                    <label className="label">Check-in</label>
                    <div className="field">
                      <CalendarDays className="icon" />
                      <input type="date" defaultValue="2026-04-02" />
                    </div>
                  </div>
                  <div>
                    <label className="label">Check-out</label>
                    <div className="field">
                      <CalendarDays className="icon" />
                      <input type="date" defaultValue="2026-04-05" />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="label">Guests</label>
                  <div className="field guest-row">
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Users className="icon" />
                      <span>{guests} Guests</span>
                    </div>
                    <div className="guest-control">
                      <button className="guest-btn" onClick={() => setGuests((g) => Math.max(1, g - 1))}>
                        <ChevronLeft className="icon" />
                      </button>
                      <button className="guest-btn plus" onClick={() => setGuests((g) => g + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                </div>

                <div className="booking-box" style={{ marginTop: 18 }}>
                  <div className="booking-top">
                    <span>{selectedRoom.name}</span>
                    <span>{nights} nights</span>
                  </div>
                  <div className="booking-total">
                    <div>
                      <div className="mini-kicker">Estimated total</div>
                      <div className="total-value">${total}</div>
                    </div>
                    <button className="reserve-btn">Reserve Now</button>
                  </div>
                </div>
              </div>

              <div className="panel">
                <h3 className="sidebar-title">Amenities</h3>
                <div className="amenities-grid">
                  {amenities.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="amenity">
                        <Icon className="icon" />
                        <div className="amenity-label">{item.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          </div>
        </section>

        <section className="testimonials">
          <div className="testimonials-grid">
            {testimonials.map((t, index) => (
              <div key={t.name} className="testimonial" style={{ animation: `fadeInUp 0.65s ease ${index * 120}ms both` }}>
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="icon fill" />
                  ))}
                </div>
                <p className="testimonial-text">“{t.text}”</p>
                <div className="testimonial-name">{t.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
