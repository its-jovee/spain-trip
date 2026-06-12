import type { Checklist } from '../types'
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

function buildChecklist(title: string, description: string, texts: string[]): Checklist {
  const id = generateId()
  return {
    id,
    title,
    description,
    items: texts.map((text, i) => ({
      ...item(text, i),
      checklistId: id,
    })),
  }
}

export const SEED_CHECKLISTS: Checklist[] = [
  buildChecklist(
    'Clothing & packing',
    'Count as you pack — adjust numbers to taste',
    [
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
      'Pajamas / sleepwear (each)',
      'Walking shoes (each)',
      'Nicer shoes for evenings (each)',
      'Bathing suit — João',
      'Bathing suit — Paula',
      'Hat / cap (each)',
      'Belt (if needed)',
    ],
  ),
  buildChecklist(
    "João's bag",
    'Tech, creative gear & personal essentials',
    [
      'Passport (6+ months validity)',
      'iPhone + charger',
      'Nintendo Switch + charger',
      'MacBook + charger',
      'Mouse',
      'Drawing pad / sketchbook',
      'Pens',
      'Pencil + eraser',
      'AirPods + charging case',
      'QCY H3 headphones',
      'Book — Taiko (Eiji Yoshikawa)',
      'Wallet, cards & some euros',
      'Comfortable walking shoes',
      'Toiletries (100ml liquids in clear bag)',
      'Sunscreen & sunglasses',
      'Any personal medications',
    ],
  ),
  buildChecklist(
    "Paula's bag",
    'Personal essentials — add anything else as you think of it',
    [
      'Passport (6+ months validity)',
      'iPhone + charger',
      'AirPods + charging case',
      'Book or two',
      'Chargers & cables for everything',
      'Comfortable walking shoes',
      'Nicer shoes for evenings',
      'Light layers for warm days & cool evenings',
      'Toiletries (100ml liquids in clear bag)',
      'Sunscreen & sunglasses',
      'Small crossbody bag for daily outings',
      'Any personal medications',
    ],
  ),
  buildChecklist(
    'Shared luggage',
    'Items we both need or share between bags',
    [
      'Travel adapters (Type C/F for Spain)',
      'Portable charger & spare cables',
      'Medications & copies of prescriptions',
      'Travel insurance documents (printed + digital)',
      'Emergency contacts card',
      'Umbrella / light rain layer',
      'Reusable water bottles',
      'Snacks for transit days',
    ],
  ),
  buildChecklist(
    'Pre-boarding — GRU → Madrid',
    'International flight from São Paulo (Brazil) to Madrid',
    [
      'Check passports: valid 6+ months beyond return date',
      'Confirm Brazilian citizens: no Schengen visa required (90/180 rule)',
      'EES / EU entry: expect fingerprint & photo at Madrid border (new system)',
      'Print or save boarding passes & booking confirmations',
      'Arrive GRU 3 hours before international departure',
      'Check baggage allowance & weight limits',
      'Liquids in carry-on: max 100ml, clear 1L bag',
      'Power bank in carry-on only (not checked luggage)',
      'Download entertainment / maps offline',
      'Notify bank of international travel',
      'Confirm travel insurance covers medical + cancellation',
      'Exchange or withdraw euros (or plan ATM on arrival)',
      'Set phones to roaming or activate eSIM for Spain',
      'Confirm airport transfer / hotel check-in time in Madrid',
    ],
  ),
  buildChecklist(
    'Trip to-dos',
    'Reservations and bookings still to confirm',
    [
      'Alcázar timed tickets — Sat Jun 20, 9:30 slot',
      'La Llorería dinner — Thu Jun 25 (book ahead)',
      'Sevilla dinners: Fatouch, La Santa (Fri), Tradevo (Sat), El Sella (Sun), Atávico (Mon)',
      'Toledo fast-train tickets — Wed Jun 24',
      'Cathedral/Giralda entry — Sun Jun 21',
      'Email Cristine Bedfor: Alameda wine tips + confirm 1 PM bag drop',
      'Soho Boutique Congreso — get booking confirmation',
    ],
  ),
  buildChecklist(
    'Before leaving home',
    'Last things before locking the door',
    [
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
    ],
  ),
]
