import React, { useEffect, useMemo, useState } from "react";
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
  Plus,
  Minus,
  Phone,
  Mail,
  UserRound,
  Loader2,
  CheckCircle2,
  Clock3,
  Hotel,
} from "lucide-react";

import { supabase } from "./supabaseclient";

const INITIAL_CHECK_IN = "2026-04-02";
const INITIAL_CHECK_OUT = "2026-04-05";
const INITIAL_DESTINATION = "Baguio, Philippines";
const INITIAL_GUESTS = 2;

const fallbackImages = {
  1: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  2: "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?auto=format&fit=crop&w=1200&q=80",
  3: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
  4: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
  5: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  6: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
  7: "https://images.unsplash.com/photo-1501117716987-c8e1ecb2108d?auto=format&fit=crop&w=1200&q=80",
  8: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=1200&q=80",
  9: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  10: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
  11: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  12: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  13: "https://images.unsplash.com/photo-1566195992011-5f6b21e1f8d1?auto=format&fit=crop&w=1200&q=80",
  14: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  15: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
  16: "https://images.unsplash.com/photo-1502672023488-70e25813eb80?auto=format&fit=crop&w=1200&q=80",
  17: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  18: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  19: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  20: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
};

const amenities = [
  { icon: Wifi, label: "Free Wi-Fi" },
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

function formatCurrency(value) {
  const amount = Number(value || 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function diffNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function isOverlapping(aStart, aEnd, bStart, bEnd) {
  const startA = new Date(aStart).getTime();
  const endA = new Date(aEnd).getTime();
  const startB = new Date(bStart).getTime();
  const endB = new Date(bEnd).getTime();
  return startA < endB && endA > startB;
}

function getRoomImage(room) {
  return room?.image_url || fallbackImages[room?.id] || fallbackImages[1];
}

function resetForm(setters) {
  setters.setFullName("");
  setters.setEmail("");
  setters.setPhone("");
  setters.setDestination("");
  setters.setGuests(INITIAL_GUESTS);
  setters.setCheckIn(INITIAL_CHECK_IN);
  setters.setCheckOut(INITIAL_CHECK_OUT);
}

function RoomCard({ room, selected, available, onSelect }) {
  const image = getRoomImage(room);
  const features = Array.isArray(room.features) ? room.features : [];

  return (
    <button
      onClick={() => onSelect(room)}
      className={cn(
        "room-card",
        selected && "room-card-selected",
        !available && "room-card-unavailable"
      )}
      type="button"
    >
      <div className="room-card-media">
        <img src={image} alt={room.room_name} />
        <div className="room-card-overlay" />
        <div className="room-badge room-badge-type">{room.room_type}</div>
        <div className="room-badge room-badge-rating">
          <Star className="icon fill" /> 4.9
        </div>

        <div className="room-card-titlewrap">
          <div className="room-card-title">{room.room_name}</div>
          <div className="room-card-subtitle">
            Capacity: {room.capacity} • ID #{room.id}
          </div>
        </div>

        <div className={cn("room-availability-chip", available ? "available" : "unavailable")}>
          {available ? "Available" : "Room is not available"}
        </div>
      </div>

      <div className="room-card-body">
        <div className="feature-list">
          {features.slice(0, 3).map((feature) => (
            <span key={feature} className="feature-pill">
              {feature}
            </span>
          ))}
        </div>

        <div className="room-card-footer">
          <div>
            <div className="section-kicker">Starting from</div>
            <div className="price-line">
              {formatCurrency(room.price_per_night)}
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
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomType, setRoomType] = useState("All");
  const [guests, setGuests] = useState(INITIAL_GUESTS);
  const [checkIn, setCheckIn] = useState(INITIAL_CHECK_IN);
  const [checkOut, setCheckOut] = useState(INITIAL_CHECK_OUT);
  const [destination, setDestination] = useState(INITIAL_DESTINATION);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [bookingState, setBookingState] = useState("idle"); // idle | checking | already_booked | confirmed

  useEffect(() => {
    loadRooms();
    loadBookings();
  }, []);

  useEffect(() => {
    if (rooms.length && !selectedRoom) {
      setSelectedRoom(rooms[0]);
    }
  }, [rooms, selectedRoom]);

  const roomAvailabilityMap = useMemo(() => {
    const map = new Map();

    for (const room of rooms) {
      let available = true;

      for (const booking of bookings) {
        if (booking.status === "cancelled") continue;
        if (Number(booking.room_id) !== Number(room.id)) continue;
        if (!checkIn || !checkOut) continue;

        if (isOverlapping(checkIn, checkOut, booking.check_in, booking.check_out)) {
          available = false;
          break;
        }
      }

      map.set(Number(room.id), available);
    }

    return map;
  }, [rooms, bookings, checkIn, checkOut]);

  const selectedRoomAvailable = useMemo(() => {
    if (!selectedRoom) return true;
    return roomAvailabilityMap.get(Number(selectedRoom.id)) !== false;
  }, [selectedRoom, roomAvailabilityMap]);

  useEffect(() => {
    const emailValue = email.trim().toLowerCase();

    if (!emailValue || !selectedRoom || !checkIn || !checkOut || bookings.length === 0) {
      if (bookingState === "already_booked") setBookingState("idle");
      return;
    }

    const hasConflict = bookings.some((booking) => {
      const sameRoom = Number(booking.room_id) === Number(selectedRoom.id);
      const sameEmail = (booking.customer?.email || "").trim().toLowerCase() === emailValue;
      const active = booking.status !== "cancelled";
      return sameRoom && sameEmail && active && isOverlapping(checkIn, checkOut, booking.check_in, booking.check_out);
    });

    setBookingState(hasConflict ? "already_booked" : "idle");
  }, [email, selectedRoom, checkIn, checkOut, bookings, bookingState]);

  async function loadRooms() {
    try {
      setLoadingRooms(true);
      setError("");
      const { data, error: roomsError } = await supabase
        .from("rooms")
        .select("id, room_type, room_name, price_per_night, capacity, features, image_url, created_at")
        .order("id", { ascending: true });

      if (roomsError) throw roomsError;

      const normalized = (data || []).map((room) => ({
        ...room,
        features: Array.isArray(room.features) ? room.features : [],
        image_url: room.image_url || fallbackImages[room.id] || fallbackImages[1],
      }));

      setRooms(normalized);
      setSelectedRoom((prev) => prev || normalized[0] || null);
    } catch (err) {
      setError(err.message || "Failed to load rooms.");
    } finally {
      setLoadingRooms(false);
    }
  }

  async function loadBookings() {
    try {
      setLoadingBookings(true);
      const [bookingsRes, customersRes, roomsRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("id, customer_id, room_id, check_in, check_out, total_guests, total_price, status, created_at")
          .order("created_at", { ascending: false }),
        supabase.from("customers").select("id, full_name, email, phone, created_at"),
        supabase.from("rooms").select("id, room_type, room_name, price_per_night, capacity, features, image_url"),
      ]);

      if (bookingsRes.error) throw bookingsRes.error;
      if (customersRes.error) throw customersRes.error;
      if (roomsRes.error) throw roomsRes.error;

      const customerMap = new Map((customersRes.data || []).map((c) => [c.id, c]));
      const roomMap = new Map((roomsRes.data || []).map((r) => [r.id, r]));

      const enriched = (bookingsRes.data || []).map((booking) => ({
        ...booking,
        customer: customerMap.get(booking.customer_id) || null,
        room: roomMap.get(booking.room_id) || null,
      }));

      setBookings(enriched);
    } catch (err) {
      setError(err.message || "Failed to load bookings.");
    } finally {
      setLoadingBookings(false);
    }
  }

  const filteredRooms = useMemo(() => {
    if (roomType === "All") return rooms;
    return rooms.filter((room) => room.room_type === roomType);
  }, [roomType, rooms]);

  const nights = useMemo(() => diffNights(checkIn, checkOut), [checkIn, checkOut]);
  const selectedPrice = Number(selectedRoom?.price_per_night || 0);
  const total = selectedPrice * nights;

  const roomTypes = useMemo(() => {
    const types = Array.from(new Set(rooms.map((room) => room.room_type)));
    return ["All", ...types];
  }, [rooms]);

  const bookingBoxClass =
    bookingState === "already_booked" || !selectedRoomAvailable
      ? "booking-box booking-box-alert"
      : bookingState === "confirmed"
      ? "booking-box booking-box-success"
      : "booking-box";

  async function handleBookRoom(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!selectedRoom) {
      setError("Please select a room.");
      return;
    }
    if (!fullName.trim() || !email.trim()) {
      setError("Full name and email are required.");
      return;
    }
    if (!checkIn || !checkOut) {
      setError("Please choose check-in and check-out dates.");
      return;
    }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setError("Check-out date must be after check-in date.");
      return;
    }
    if (guests < 1) {
      setError("Guests must be at least 1.");
      return;
    }
    if (selectedRoom.capacity && guests > Number(selectedRoom.capacity)) {
      setError(`This room supports up to ${selectedRoom.capacity} guests.`);
      return;
    }

    const emailValue = email.trim().toLowerCase();

    const conflictingBooking = bookings.find((booking) => {
      const active = booking.status !== "cancelled";
      const sameRoom = Number(booking.room_id) === Number(selectedRoom.id);
      return active && sameRoom && isOverlapping(checkIn, checkOut, booking.check_in, booking.check_out);
    });

    if (conflictingBooking) {
      setBookingState("already_booked");
      setError("Room is not available for the selected dates.");
      return;
    }

    try {
      setSaving(true);
      setBookingState("checking");

      const { data: existingCustomer, error: customerLookupError } = await supabase
        .from("customers")
        .select("id")
        .eq("email", emailValue)
        .maybeSingle();

      if (customerLookupError && customerLookupError.code !== "PGRST116") {
        throw customerLookupError;
      }

      let customerId = existingCustomer?.id;

      if (!customerId) {
        const { data: newCustomer, error: createCustomerError } = await supabase
          .from("customers")
          .insert([
            {
              full_name: fullName.trim(),
              email: emailValue,
              phone: phone.trim(),
            },
          ])
          .select("id")
          .single();

        if (createCustomerError) throw createCustomerError;
        customerId = newCustomer.id;
      } else {
        const { error: updateCustomerError } = await supabase
          .from("customers")
          .update({ full_name: fullName.trim(), phone: phone.trim() })
          .eq("id", customerId);

        if (updateCustomerError) throw updateCustomerError;
      }

      const totalPrice = selectedPrice * nights;

      const { error: insertBookingError } = await supabase.from("bookings").insert([
        {
          customer_id: customerId,
          room_id: selectedRoom.id,
          check_in: checkIn,
          check_out: checkOut,
          total_guests: guests,
          total_price: totalPrice,
          status: "confirmed",
        },
      ]);

      if (insertBookingError) throw insertBookingError;

      const { error: guestError } = await supabase.from("guests").insert([
        {
          full_name: fullName.trim(),
          email: emailValue,
          phone: phone.trim(),
        },
      ]);

      if (guestError) {
        console.warn("Guest insert skipped/failed:", guestError.message);
      }

      setSuccess(`Booking confirmed for ${selectedRoom.room_name}.`);
      setBookingState("confirmed");

      resetForm({
        setFullName,
        setEmail,
        setPhone,
        setDestination,
        setGuests,
        setCheckIn,
        setCheckOut,
      });

      await Promise.all([loadBookings(), loadRooms()]);
    } catch (err) {
      setError(err.message || "Booking failed.");
      setBookingState("idle");
    } finally {
      setSaving(false);
    }
  }

  function guestDown() {
    setGuests((value) => Math.max(1, value - 1));
  }

  function guestUp() {
    setGuests((value) => Math.min(selectedRoom?.capacity || 10, value + 1));
  }

  return (
    <div className="hotel-app">
      <style>{`
        :root {
          --bg: #f6f7fb;
          --surface: rgba(255, 255, 255, 0.82);
          --surface-strong: rgba(255, 255, 255, 0.96);
          --text: #0f172a;
          --muted: #64748b;
          --line: rgba(148, 163, 184, 0.16);
          --shadow: 0 18px 60px rgba(15, 23, 42, 0.08);
          --shadow-strong: 0 28px 70px rgba(15, 23, 42, 0.14);
        }

        * {
          box-sizing: border-box;
        }

        html,
        body,
        #root {
          margin: 0;
          min-height: 100%;
          background: var(--bg);
        }

        body {
          font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
          color: var(--text);
          -webkit-font-smoothing: antialiased;
          text-rendering: optimizeLegibility;
        }

        button,
        input {
          font: inherit;
        }

        img {
          display: block;
          width: 100%;
        }

        .hotel-app {
          min-height: 100vh;
          background:
            radial-gradient(circle at top, rgba(255, 255, 255, 0.96), rgba(241, 245, 249, 0.94), rgba(226, 232, 240, 1));
          padding: 16px;
        }

        .page-shell {
          max-width: 1280px;
          margin: 0 auto;
          border-radius: 30px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.9);
          background: rgba(255, 255, 255, 0.60);
          box-shadow: 0 24px 90px rgba(15, 23, 42, 0.10);
          backdrop-filter: blur(18px);
        }

        .hero {
          position: relative;
          overflow: hidden;
          padding: 52px 28px;
          color: var(--text);
          isolation: isolate;
        }

        .hero-bg {
          position: absolute;
          inset: 0;
          z-index: -2;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.90), rgba(248, 250, 252, 0.96)),
            radial-gradient(circle at top right, rgba(96, 165, 250, 0.14), transparent 34%),
            radial-gradient(circle at bottom left, rgba(129, 140, 248, 0.10), transparent 32%);
        }

        .hero-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(48px);
          z-index: -1;
          opacity: 0.65;
          animation: floatUp 7s ease-in-out infinite;
        }

        .hero-glow.one {
          width: 260px;
          height: 260px;
          top: -60px;
          right: -50px;
          background: rgba(96, 165, 250, 0.18);
        }

        .hero-glow.two {
          width: 300px;
          height: 300px;
          left: -90px;
          bottom: -80px;
          background: rgba(99, 102, 241, 0.10);
        }

        .hero-grid {
          display: grid;
          gap: 34px;
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
          background: rgba(255, 255, 255, 0.74);
          border: 1px solid rgba(255, 255, 255, 0.92);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          font-size: 14px;
          margin-bottom: 18px;
          color: #334155;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
          animation: fadeInUp 0.7s ease both;
        }

        .eyebrow:hover {
          transform: translateY(-1px);
          background: rgba(255, 255, 255, 0.90);
          box-shadow: 0 14px 34px rgba(15, 23, 42, 0.08);
        }

        .eyebrow .icon {
          width: 16px;
          height: 16px;
          color: #2563eb;
        }

        .hero h1 {
          margin: 0;
          max-width: 760px;
          font-size: clamp(2.2rem, 4.8vw, 4.2rem);
          line-height: 1.06;
          letter-spacing: -0.04em;
          color: #0f172a;
          animation: fadeInUp 0.8s ease both;
        }

        .hero p {
          max-width: 640px;
          margin: 16px 0 0;
          color: #64748b;
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
          border-radius: 16px;
          padding: 13px 18px;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, color 0.25s ease;
          text-decoration: none;
        }

        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.10);
        }

        .btn:active {
          transform: translateY(0);
        }

        .btn-primary {
          background: #0f172a;
          color: white;
          font-weight: 700;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.90);
          color: #0f172a;
          border: 1px solid rgba(148, 163, 184, 0.18);
          font-weight: 700;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          margin-top: 30px;
          max-width: 640px;
        }

        .stat {
          border-radius: 20px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.84);
          border: 1px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .stat:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 34px rgba(15, 23, 42, 0.08);
        }

        .stat-value {
          font-size: 1.45rem;
          font-weight: 800;
          line-height: 1.1;
          color: #0f172a;
        }

        .stat-label {
          margin-top: 8px;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #64748b;
        }

        .hero-preview {
          border-radius: 28px;
          padding: 18px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(255, 255, 255, 0.94);
          box-shadow: var(--shadow);
          backdrop-filter: blur(18px);
          animation: fadeInUp 0.85s ease both;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .hero-preview:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-strong);
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
          font-size: 13px;
          color: #64748b;
        }

        .preview-head h2 {
          margin: 4px 0 0;
          font-size: 24px;
          line-height: 1.14;
          color: #0f172a;
        }

        .preview-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: rgba(96, 165, 250, 0.10);
          color: #2563eb;
          transition: transform 0.25s ease, background 0.25s ease;
        }

        .preview-icon:hover {
          transform: rotate(6deg) scale(1.04);
          background: rgba(96, 165, 250, 0.16);
        }

        .preview-image {
          border-radius: 24px;
          overflow: hidden;
          height: 260px;
          background: #e2e8f0;
        }

        .preview-image img {
          height: 100%;
          object-fit: cover;
          transition: transform 0.7s ease;
        }

        .preview-image:hover img {
          transform: scale(1.06);
        }

        .preview-grid {
          display: grid;
          gap: 12px;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          margin-top: 16px;
        }

        .mini-card {
          border-radius: 18px;
          padding: 16px;
          background: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.14);
          transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease;
        }

        .mini-card:hover {
          transform: translateY(-2px);
          background: white;
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.06);
        }

        .mini-kicker {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #64748b;
        }

        .mini-value {
          margin-top: 6px;
          font-size: 17px;
          font-weight: 800;
          color: #0f172a;
        }

        .content {
          padding: 24px 28px 40px;
        }

        @media (min-width: 1024px) {
          .content {
            padding: 30px 56px 44px;
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

        .section-title {
          font-size: 28px;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: #0f172a;
        }

        .filters {
          display: flex;
          gap: 8px;
          padding: 6px;
          border-radius: 18px;
          background: rgba(15, 23, 42, 0.96);
          box-shadow: 0 10px 26px rgba(15, 23, 42, 0.16);
          flex-wrap: wrap;
        }

        .filter-btn {
          border: 0;
          border-radius: 13px;
          padding: 10px 14px;
          cursor: pointer;
          background: transparent;
          color: rgba(255, 255, 255, 0.78);
          font-weight: 600;
          transition: background 0.25s ease, transform 0.25s ease, color 0.25s ease;
        }

        .filter-btn:hover {
          transform: translateY(-1px);
          color: #fff;
        }

        .filter-btn.active {
          background: white;
          color: #0f172a;
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.10);
        }

        .room-grid {
          display: grid;
          gap: 20px;
          grid-template-columns: repeat(1, minmax(0, 1fr));
        }

        @media (min-width: 768px) {
          .room-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (min-width: 1280px) {
          .room-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .room-card {
          border: 1px solid rgba(255, 255, 255, 0.96);
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(16px);
          box-shadow: var(--shadow);
          cursor: pointer;
          text-align: left;
          padding: 0;
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease, opacity 0.28s ease;
        }

        .room-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-strong);
          border-color: rgba(37, 99, 235, 0.18);
        }

        .room-card-selected {
          border-color: rgba(37, 99, 235, 0.28);
          box-shadow: 0 18px 50px rgba(37, 99, 235, 0.10);
        }

        .room-card-unavailable {
          opacity: 0.76;
        }

        .room-card-media {
          position: relative;
          height: 238px;
          overflow: hidden;
        }

        .room-card-media img {
          height: 100%;
          object-fit: cover;
          transition: transform 0.8s ease, filter 0.28s ease;
        }

        .room-card-unavailable .room-card-media img {
          filter: saturate(0.86) brightness(0.92);
        }

        .room-card:hover .room-card-media img {
          transform: scale(1.08);
        }

        .room-card-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(15, 23, 42, 0.62), rgba(15, 23, 42, 0.08), transparent);
          transition: opacity 0.28s ease;
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
          background: rgba(255, 255, 255, 0.92);
          color: #0f172a;
        }

        .room-badge-rating {
          right: 16px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(15, 23, 42, 0.72);
          color: white;
        }

        .room-card:hover .room-badge {
          transform: translateY(-1px);
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
          font-size: 20px;
          font-weight: 800;
          line-height: 1.15;
          margin-bottom: 6px;
        }

        .room-card-subtitle {
          color: rgba(255, 255, 255, 0.84);
          font-size: 13px;
        }

        .room-availability-chip {
          position: absolute;
          left: 16px;
          bottom: 16px;
          transform: translateY(44px);
          opacity: 0;
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.01em;
          transition: transform 0.28s ease, opacity 0.28s ease, background 0.28s ease;
          backdrop-filter: blur(12px);
        }

        .room-card:hover .room-availability-chip,
        .room-card-selected .room-availability-chip {
          opacity: 1;
          transform: translateY(0);
        }

        .room-availability-chip.available {
          background: rgba(34, 197, 94, 0.92);
          color: white;
        }

        .room-availability-chip.unavailable {
          background: rgba(239, 68, 68, 0.92);
          color: white;
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
          background: #f8fafc;
          color: #334155;
          border: 1px solid rgba(148, 163, 184, 0.12);
          font-size: 12px;
          font-weight: 600;
          transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
        }

        .room-card:hover .feature-pill {
          background: #0f172a;
          color: white;
          border-color: rgba(15, 23, 42, 0.08);
        }

        .feature-pill:hover {
          transform: translateY(-1px);
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
          font-size: 30px;
          font-weight: 800;
          line-height: 1;
          color: #0f172a;
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
          border-radius: 14px;
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
          gap: 20px;
        }

        .panel {
          border-radius: 24px;
          background: var(--surface-strong);
          border: 1px solid rgba(148, 163, 184, 0.16);
          box-shadow: 0 18px 48px rgba(15, 23, 42, 0.06);
          padding: 22px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .panel:hover {
          transform: translateY(-3px);
          box-shadow: 0 24px 60px rgba(15, 23, 42, 0.08);
        }

        .panel-header {
          display: flex;
          align-items: start;
          justify-content: space-between;
          gap: 12px;
        }

        .panel-header h3 {
          font-size: 26px;
          line-height: 1.1;
          margin-top: 6px;
          color: #0f172a;
        }

        .shield-box {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: #0f172a;
          color: white;
          display: grid;
          place-items: center;
          transition: transform 0.25s ease;
        }

        .shield-box:hover {
          transform: rotate(6deg) scale(1.04);
        }

        .form-group {
          margin-top: 16px;
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
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.18);
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
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
          border-color: rgba(37, 99, 235, 0.20);
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
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
          box-shadow: 0 6px 16px rgba(15, 23, 42, 0.06);
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .guest-btn:hover {
          transform: translateY(-1px) scale(1.04);
          box-shadow: 0 10px 22px rgba(15, 23, 42, 0.10);
        }

        .guest-btn.plus {
          background: #0f172a;
          color: white;
        }

        .booking-box {
          border-radius: 22px;
          padding: 20px;
          background: #0f172a;
          color: white;
          box-shadow: 0 18px 44px rgba(15, 23, 42, 0.16);
          transition: transform 0.28s ease, box-shadow 0.28s ease, border-color 0.28s ease;
        }

        .booking-box:hover {
          transform: translateY(-2px);
          box-shadow: 0 24px 56px rgba(15, 23, 42, 0.20);
        }

        .booking-box-alert {
          border: 1px solid rgba(248, 113, 113, 0.65);
          animation: alertPulse 1.3s ease-in-out infinite;
        }

        .booking-box-success {
          border: 1px solid rgba(74, 222, 128, 0.55);
          animation: successGlow 1.6s ease-in-out infinite;
        }

        .booking-top {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          align-items: center;
          color: rgba(255, 255, 255, 0.72);
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
          font-size: 32px;
          line-height: 1;
          font-weight: 800;
          margin-top: 6px;
        }

        .reserve-btn {
          border: 0;
          border-radius: 16px;
          background: white;
          color: #0f172a;
          font-weight: 800;
          padding: 14px 16px;
          cursor: pointer;
          transition: transform 0.25s ease, box-shadow 0.25s ease, opacity 0.25s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-width: 152px;
        }

        .reserve-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 26px rgba(255, 255, 255, 0.14);
        }

        .reserve-btn:disabled {
          opacity: 0.72;
          cursor: not-allowed;
          transform: none;
        }

        .availability-note {
          margin-top: 12px;
          padding: 12px 14px;
          border-radius: 16px;
          font-size: 13px;
          line-height: 1.6;
          transition: opacity 0.28s ease, transform 0.28s ease;
        }

        .availability-note.available {
          background: rgba(34, 197, 94, 0.12);
          color: #dcfce7;
          border: 1px solid rgba(74, 222, 128, 0.25);
        }

        .availability-note.unavailable {
          background: rgba(248, 113, 113, 0.10);
          color: #fecaca;
          border: 1px solid rgba(248, 113, 113, 0.25);
        }

        .amenities-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 18px;
        }

        .amenity {
          border-radius: 18px;
          background: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.12);
          padding: 16px;
          transition: transform 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
        }

        .amenity:hover {
          transform: translateY(-2px);
          background: white;
          box-shadow: 0 12px 26px rgba(15, 23, 42, 0.06);
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
          gap: 18px;
        }

        @media (min-width: 1024px) {
          .testimonials {
            padding: 0 56px 44px;
          }
        }

        .testimonials-grid {
          display: grid;
          gap: 16px;
        }

        @media (min-width: 1024px) {
          .testimonials-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        .testimonial {
          border-radius: 22px;
          background: rgba(255, 255, 255, 0.88);
          border: 1px solid rgba(148, 163, 184, 0.14);
          box-shadow: 0 16px 40px rgba(15, 23, 42, 0.06);
          padding: 20px;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }

        .testimonial:hover {
          transform: translateY(-2px);
          box-shadow: 0 22px 50px rgba(15, 23, 42, 0.08);
        }

        .stars {
          display: flex;
          gap: 2px;
          color: #f59e0b;
        }

        .testimonial-text {
          margin: 14px 0 0;
          color: #475569;
          line-height: 1.8;
          font-size: 14px;
        }

        .testimonial-name {
          margin-top: 16px;
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

        .notice {
          border-radius: 18px;
          padding: 14px 16px;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          box-shadow: 0 10px 24px rgba(15, 23, 42, 0.04);
        }

        .notice.error {
          background: #fff1f2;
          color: #b91c1c;
          border: 1px solid #fecaca;
        }

        .notice.success {
          background: #ecfdf5;
          color: #047857;
          border: 1px solid #a7f3d0;
        }

        .bookings-list {
          display: grid;
          gap: 12px;
          margin-top: 16px;
        }

        .booking-item {
          border-radius: 16px;
          background: #f8fafc;
          border: 1px solid rgba(148, 163, 184, 0.12);
          padding: 14px;
          transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
        }

        .booking-item:hover {
          transform: translateY(-2px);
          background: white;
          box-shadow: 0 12px 24px rgba(15, 23, 42, 0.05);
        }

        .booking-item-top {
          display: flex;
          justify-content: space-between;
          gap: 10px;
          align-items: start;
        }

        .booking-room {
          font-weight: 700;
          color: #0f172a;
          margin: 0;
        }

        .booking-meta {
          margin: 6px 0 0;
          color: #64748b;
          font-size: 13px;
          line-height: 1.7;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 999px;
          background: #0f172a;
          color: white;
          font-size: 12px;
          font-weight: 700;
          white-space: nowrap;
          text-transform: capitalize;
        }

        .status-pill.confirmed {
          background: #0f172a;
        }

        .status-pill.pending {
          background: #a16207;
        }

        .status-pill.cancelled {
          background: #991b1b;
        }

        .status-pill.complete {
          background: #065f46;
        }

        .booking-alert {
          animation: alertShake 0.45s ease-in-out 0s 2;
        }

        .booking-state-text {
          margin-top: 12px;
          font-size: 13px;
          line-height: 1.6;
          opacity: 0.95;
        }

        .booking-state-text.already {
          color: #fecaca;
        }

        .booking-state-text.confirmed {
          color: #bbf7d0;
        }

        .booking-state-text.checking {
          color: #bfdbfe;
        }

        @keyframes floatUp {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
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

        @keyframes alertPulse {
          0%,
          100% {
            box-shadow: 0 18px 44px rgba(15, 23, 42, 0.16);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(248, 113, 113, 0.12), 0 18px 44px rgba(15, 23, 42, 0.16);
          }
        }

        @keyframes successGlow {
          0%,
          100% {
            box-shadow: 0 18px 44px rgba(15, 23, 42, 0.16);
          }
          50% {
            box-shadow: 0 0 0 6px rgba(74, 222, 128, 0.10), 0 18px 44px rgba(15, 23, 42, 0.16);
          }
        }

        @keyframes alertShake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-2px);
          }
          50% {
            transform: translateX(2px);
          }
          75% {
            transform: translateX(-1px);
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
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
          }

          .room-card-title {
            font-size: 19px;
          }

          .total-value {
            font-size: 28px;
          }

          .stats {
            grid-template-columns: 1fr;
          }

          .preview-grid,
          .amenities-grid {
            grid-template-columns: 1fr;
          }

          .booking-total {
            align-items: stretch;
            flex-direction: column;
          }

          .reserve-btn {
            width: 100%;
          }

          .hero h1 {
            font-size: clamp(2rem, 8vw, 3rem);
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

              <h1>Book your perfect stay with a sleek, modern hotel interface.</h1>
              <p>
                Explore rooms, compare amenities, and create bookings that save directly to your
                Supabase tables.
              </p>

              <div className="hero-actions">
                <button
                  className="btn btn-primary"
                  type="button"
                  onClick={() => document.getElementById("room-options")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <Search className="icon" />
                  Explore Rooms
                </button>
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => document.getElementById("booking-panel")?.scrollIntoView({ behavior: "smooth" })}
                >
                  <CalendarDays className="icon" />
                  Check Availability
                </button>
              </div>

              <div className="stats">
                <div className="stat">
                  <div className="stat-value">{rooms.length || 20}+</div>
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
                  <h2>{selectedRoom?.room_name || "Select a room"}</h2>
                </div>
                <div className="preview-icon">
                  <BedDouble className="icon" />
                </div>
              </div>

              <div className="preview-image">
                <img
                  src={getRoomImage(selectedRoom)}
                  alt={selectedRoom?.room_name || "Room preview"}
                />
              </div>

              <div className="preview-grid">
                <div className="mini-card">
                  <div className="mini-kicker">Room Type</div>
                  <div className="mini-value">{selectedRoom?.room_type || "—"}</div>
                </div>
                <div className="mini-card">
                  <div className="mini-kicker">Rate</div>
                  <div className="mini-value">
                    {selectedRoom ? `${formatCurrency(selectedRoom.price_per_night)}/night` : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="content" id="room-options">
          <div className="section-header">
            <div>
              <div className="muted">Choose your stay</div>
              <h2 className="section-title">Room options</h2>
            </div>

            <div className="filters">
              {roomTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setRoomType(type)}
                  className={cn("filter-btn", roomType === type && "active")}
                  type="button"
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {error ? (
            <div className={cn("notice error", bookingState === "already_booked" && "booking-alert")}>
              <Hotel className="icon" />
              {error}
            </div>
          ) : null}

          {success ? (
            <div className="notice success">
              <CheckCircle2 className="icon" />
              {success}
            </div>
          ) : null}

          <div className="hero-grid" style={{ alignItems: "start" }}>
            <div>
              {loadingRooms ? (
                <div className="panel" style={{ textAlign: "center", padding: 40 }}>
                  <Loader2 className="icon" style={{ animation: "spin 1s linear infinite" }} />
                  <p style={{ marginTop: 12, color: "#64748b" }}>Loading rooms...</p>
                </div>
              ) : (
                <div className="room-grid">
                  {filteredRooms.map((room, index) => {
                    const available = roomAvailabilityMap.get(Number(room.id)) !== false;
                    return (
                      <div
                        key={room.id}
                        style={{ animation: `fadeInUp 0.65s ease ${index * 120}ms both` }}
                      >
                        <RoomCard
                          room={room}
                          selected={selectedRoom?.id === room.id}
                          available={available}
                          onSelect={setSelectedRoom}
                        />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <aside className="sidebar" id="booking-panel">
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

                <form onSubmit={handleBookRoom}>
                  <div className="form-group">
                    <label className="label">Full name</label>
                    <div className="field">
                      <UserRound className="icon" />
                      <input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Juan Dela Cruz"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label">Email</label>
                    <div className="field">
                      <Mail className="icon" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="juan@email.com"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label">Phone</label>
                    <div className="field">
                      <Phone className="icon" />
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="0917 000 0000"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label">Destination</label>
                    <div className="field">
                      <MapPin className="icon" />
                      <input
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Baguio, Philippines"
                      />
                    </div>
                  </div>

                  <div
                    className="form-group"
                    style={{
                      display: "grid",
                      gap: 14,
                      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                    }}
                  >
                    <div>
                      <label className="label">Check-in</label>
                      <div className="field">
                        <CalendarDays className="icon" />
                        <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                      </div>
                    </div>
                    <div>
                      <label className="label">Check-out</label>
                      <div className="field">
                        <CalendarDays className="icon" />
                        <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="label">Guests</label>
                    <div className="field guest-row">
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <Users className="icon" />
                        <div>
                          <div style={{ fontWeight: 700, color: "#0f172a" }}>{guests} guest(s)</div>
                          <div style={{ fontSize: 13, color: "#64748b" }}>
                            Max: {selectedRoom?.capacity || "—"}
                          </div>
                        </div>
                      </div>

                      <div className="guest-control">
                        <button className="guest-btn" type="button" onClick={guestDown}>
                          <Minus className="icon" />
                        </button>
                        <button className="guest-btn plus" type="button" onClick={guestUp}>
                          <Plus className="icon" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className={bookingBoxClass} style={{ marginTop: 18 }}>
                    <div className="booking-top">
                      <span>Room</span>
                      <span>{selectedRoom?.room_name || "No room selected"}</span>
                    </div>

                    <div className="booking-top" style={{ marginTop: 8 }}>
                      <span>Nights</span>
                      <span>{nights}</span>
                    </div>

                    <div className="booking-total">
                      <div>
                        <div style={{ opacity: 0.72, fontSize: 14 }}>Estimated total</div>
                        <div className="total-value">{formatCurrency(total)}</div>
                      </div>

                      <button
                        className="reserve-btn"
                        type="submit"
                        disabled={saving || !selectedRoom || !selectedRoomAvailable}
                      >
                        {saving ? (
                          <>
                            <Loader2 className="icon" style={{ animation: "spin 1s linear infinite" }} />
                            Saving...
                          </>
                        ) : !selectedRoomAvailable ? (
                          <>
                            Room Not Available
                            <Hotel className="icon" />
                          </>
                        ) : bookingState === "already_booked" ? (
                          <>
                            Already Booked
                            <CheckCircle2 className="icon" />
                          </>
                        ) : (
                          <>
                            Reserve Now
                            <ChevronRight className="icon" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className={cn("availability-note", selectedRoomAvailable ? "available" : "unavailable")}>
                      {selectedRoomAvailable
                        ? "Room is available for the selected dates."
                        : "Room is not available for the selected dates."}
                    </div>

                    {bookingState === "already_booked" ? (
                      <div className="booking-state-text already">
                        You already have a booking for this room and date range.
                      </div>
                    ) : bookingState === "confirmed" ? (
                      <div className="booking-state-text confirmed">
                        Your reservation is confirmed.
                      </div>
                    ) : bookingState === "checking" ? (
                      <div className="booking-state-text checking">
                        Checking booking availability...
                      </div>
                    ) : null}
                  </div>
                </form>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Included</div>
                    <h3 className="sidebar-title">Amenities</h3>
                  </div>
                  <div className="shield-box">
                    <Waves className="icon" />
                  </div>
                </div>

                <div className="amenities-grid">
                  {amenities.map((amenity) => {
                    const Icon = amenity.icon;
                    return (
                      <div key={amenity.label} className="amenity">
                        <Icon className="icon" />
                        <div className="amenity-label">{amenity.label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <div>
                    <div className="muted" style={{ fontSize: 14, fontWeight: 600 }}>Live data</div>
                    <h3 className="sidebar-title">Recent bookings</h3>
                  </div>
                  <div className="shield-box">
                    <Clock3 className="icon" />
                  </div>
                </div>

                {loadingBookings ? (
                  <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14 }}>
                    <Loader2 className="icon" style={{ animation: "spin 1s linear infinite" }} />
                    <span style={{ color: "#64748b" }}>Loading bookings...</span>
                  </div>
                ) : (
                  <div className="bookings-list">
                    {bookings.length === 0 ? (
                      <div style={{ color: "#64748b", marginTop: 10 }}>No bookings yet.</div>
                    ) : (
                      bookings.map((booking) => (
                        <div key={booking.id} className="booking-item">
                          <div className="booking-item-top">
                            <div>
                              <p className="booking-room">
                                {booking.room?.room_name || `Room #${booking.room_id}`}
                              </p>
                              <p className="booking-meta">
                                {booking.customer?.full_name || "Guest"} • {booking.total_guests} guest(s)
                                <br />
                                {formatDate(booking.check_in)} → {formatDate(booking.check_out)}
                              </p>
                            </div>
                            <span className={cn("status-pill", booking.status || "confirmed")}>
                              {booking.status || "confirmed"}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>

        <section className="testimonials">
          <div className="section-header">
            <div>
              <div className="muted">What guests say</div>
              <h2 className="section-title">Testimonials</h2>
            </div>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((item) => (
              <div key={item.name} className="testimonial">
                <div className="stars">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="icon fill" />
                  ))}
                </div>
                <p className="testimonial-text">{item.text}</p>
                <div className="testimonial-name">{item.name}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}