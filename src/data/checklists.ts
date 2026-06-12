import type { Checklist, TripLeg } from '../types'
import { generateId } from '../lib/utils'

function item(text: string, sortOrder: number) {
  return {
    id: generateId(),
    checklistId: '',
    text,
    checked: false,
    sortOrder,
  }
}

function buildChecklist(
  leg: TripLeg,
  title: string,
  description: string,
  texts: string[],
  id?: string,
): Checklist {
  const checklistId = id ?? generateId()
  return {
    id: checklistId,
    leg,
    title,
    description,
    items: texts.map((text, i) => ({
      ...item(text, i),
      checklistId,
    })),
  }
}

export const SEED_CHECKLISTS: Checklist[] = [
  // —— GRU → MAD ——
  buildChecklist('gru-mad', 'Before leaving home', 'Last things before locking the door', [
    'Unplug non-essential appliances',
    'Take out trash',
    'Water plants / arrange plant care',
    'Set thermostat appropriately',
    'Lock all windows and doors',
    'Leave a key with someone trusted (if needed)',
    'Set out-of-office / auto-replies',
    'Charge all devices overnight',
    'Pack passports in carry-on (not checked bag)',
    'Final walk-through of apartment',
  ], 'b1000001-0001-4000-8000-000000000001'),
  buildChecklist('gru-mad', 'Flight — GRU → Madrid', 'Fri Jun 12 · depart 19:20', [
    'Check passports: valid 6+ months beyond return date',
    'Confirm Brazilian citizens: no Schengen visa required (90/180 rule)',
    'Boarding passes saved (João IB0272 · Paula LA1526)',
    'Arrive GRU 3 hours before departure (Terminal 3)',
    'Check baggage allowance & weight limits',
    'Liquids in carry-on: max 100ml, clear 1L bag',
    'Power bank in carry-on only',
    'Download entertainment / maps offline',
    'Notify bank of international travel',
    'EES / EU entry: expect fingerprint & photo at Madrid',
    'Set phones to roaming or activate eSIM for Spain',
  ], 'b1000001-0001-4000-8000-000000000002'),
  buildChecklist('gru-mad', 'Clothing & packing', 'Count as you pack — adjust numbers to taste', [
    'Underwear — João (×7)',
    'Underwear — Paula (×7)',
    'Socks — João (×7)',
    'Socks — Paula (×7)',
    'T-shirts / tops — João (×5)',
    'Tops / blouses — Paula (×5)',
    'Pants / shorts — João (×3)',
    'Pants / skirt / dress — Paula (×3)',
    'Light layer / cardigan (each)',
    'Nicer outfit for dinners (each)',
    'Pajamas (each)',
    'Walking shoes (each)',
    'Nicer shoes for evenings (each)',
    'Bathing suit — João',
    'Bathing suit — Paula',
    'Hat / cap (each)',
  ], 'b1000001-0001-4000-8000-000000000003'),
  buildChecklist('gru-mad', "João's bag", 'Tech, creative gear & personal essentials', [
    'Passport',
    'iPhone + charger',
    'Nintendo Switch + charger',
    'MacBook + charger',
    'Mouse',
    'Drawing pad / sketchbook',
    'Pens · pencil + eraser',
    'AirPods + charging case',
    'QCY H3 headphones',
    'Book — Taiko (Eiji Yoshikawa)',
    'Wallet, cards & some euros',
    'Toiletries (100ml liquids in clear bag)',
    'Sunscreen & sunglasses',
    'Medications',
  ], 'b1000001-0001-4000-8000-000000000004'),
  buildChecklist('gru-mad', "Paula's bag", 'Personal essentials', [
    'Passport',
    'iPhone + charger',
    'AirPods + charging case',
    'Book or two',
    'Chargers & cables for everything',
    'Comfortable walking shoes',
    'Nicer shoes for evenings',
    'Light layers',
    'Toiletries (100ml liquids in clear bag)',
    'Sunscreen & sunglasses',
    'Small crossbody bag',
    'Medications',
  ], 'b1000001-0001-4000-8000-000000000005'),
  buildChecklist('gru-mad', 'Shared luggage', 'Items we both need', [
    'Travel adapters (Type C/F for Spain)',
    'Portable charger & spare cables',
    'Travel insurance (printed + digital)',
    'Emergency contacts card',
    'Umbrella / light rain layer',
    'Reusable water bottles',
    'Snacks for the flight',
  ], 'b1000001-0001-4000-8000-000000000006'),
  buildChecklist('gru-mad', 'Madrid arrival', 'Sat Jun 13 · Soho Boutique Congreso', [
    'Soho Boutique Congreso — confirmation (pending)',
    'Taxi/Cercanías from Barajas to hotel',
    'Drop bags · easy first evening',
    'Exchange or withdraw euros if needed',
  ], 'b1000001-0001-4000-8000-000000000007'),

  // —— MAD → SEV ——
  buildChecklist('mad-sev', 'Leave Madrid', 'Fri Jun 19 · before 10:30 train', [
    'Check out Soho Boutique Congreso',
    'Bags packed for 4 nights in Sevilla',
    'Leave hotel ~09:00 for Atocha',
    'Snacks / water for the train',
  ], 'b1000002-0002-4000-8000-000000000001'),
  buildChecklist('mad-sev', 'Train — Madrid → Sevilla', 'iryo KF7199 · 10:30 → 13:09', [
    'Tickets in app or printed (locator KF7199)',
    'João — Car 2 · Seat 16A',
    'Paula — Car 2 · Seat 16D',
    'Arrive Atocha 30 min early',
    'Boarding closes 2 min before departure',
  ], 'b1000002-0002-4000-8000-000000000002'),
  buildChecklist('mad-sev', 'Sevilla arrival', 'Cristine Bedfor · 4 nights', [
    'Hotel confirmation P8371918',
    'Arrive ~13:30 · bags held until 15:00 check-in',
    'Light lunch near Alameda (Fatouch / Beirutina)',
    'Alcázar tickets — Sat 20, 9:30 slot',
    'Confirm Sevilla dinners: La Santa (Fri), Tradevo (Sat), El Sella (Sun), Atávico (Mon)',
    'Cathedral/Giralda entry — Sun Jun 21',
    'Email Cristine Bedfor: wine tips + bag drop',
  ], 'b1000002-0002-4000-8000-000000000003'),

  // —— SEV → MAD ——
  buildChecklist('sev-mad', 'Leave Sevilla', 'Tue Jun 23 · before 12:25 train', [
    'Check out Cristine Bedfor',
    'Breakfast at hotel',
    'Last wander around Alameda',
    'Leave hotel ~11:30 for Santa Justa',
  ], 'b1000003-0003-4000-8000-000000000001'),
  buildChecklist('sev-mad', 'Train — Sevilla → Madrid', 'iryo 02FU39 · 12:25 → 15:02', [
    'Tickets in app or printed (locator 02FU39)',
    'João — Car 2 · Seat 2A',
    'Paula — Car 2 · Seat 2B',
    'Arrive station 30 min early',
  ], 'b1000003-0003-4000-8000-000000000002'),
  buildChecklist('sev-mad', 'Madrid — Alba', 'Room Mate Collection Alba · 3 nights', [
    'Booking 26061297620 · PIN 190591',
    'Check-in from 15:00 (arrive ~15:02)',
    'Toledo fast-train tickets — Wed Jun 24',
    'La Llorería dinner — Thu Jun 25 (book ahead)',
    'Museums on foot from Huertas / Letras',
  ], 'b1000003-0003-4000-8000-000000000003'),

  // —— MAD → GRU ——
  buildChecklist('mad-gru', 'Before leaving Madrid', 'Fri Jun 26 · flight 14:45', [
    'Check out Room Mate Alba by 12:00',
    'Pack passports in carry-on',
    'Charge all devices overnight Thu',
    'Be at Barajas ~12:00',
    'Slow final morning — last café',
  ], 'b1000004-0004-4000-8000-000000000004'),
  buildChecklist('mad-gru', 'Flight — Madrid → GRU', 'João IB6809 · Paula LA8075', [
    'Boarding passes saved',
    'João — 1×23kg checked + carry-on',
    'Paula — carry-on only',
    'Liquids in carry-on (100ml rule)',
    'Power bank in carry-on',
    'Snacks for the flight',
    'Download entertainment offline',
  ], 'b1000004-0004-4000-8000-000000000005'),
  buildChecklist('mad-gru', 'Back home', 'After landing', [
    'Customs & baggage claim',
    'Transport home from GRU',
    'Unpack essentials first',
    'Check nothing left in hotel / train',
  ], 'b1000004-0004-4000-8000-000000000006'),
]
