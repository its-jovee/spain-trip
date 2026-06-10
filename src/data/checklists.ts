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
    'Shared luggage',
    'Items we both need or share between bags',
    [
      'Travel adapters (Type C/F for Spain)',
      'Portable charger & cables',
      'Medications & copies of prescriptions',
      'Travel insurance documents (printed + digital)',
      'Emergency contacts card',
      'Umbrella / light rain layer',
      'Reusable water bottles',
      'Snacks for transit days',
    ],
  ),
  buildChecklist(
    "Paula's bag",
    'Personal essentials for Paula',
    [
      'Passport (6+ months validity)',
      'Comfortable walking shoes',
      'Light layers for Madrid evenings',
      'Sunscreen & sunglasses',
      'Toiletries (100ml liquids in clear bag)',
      'Camera / phone for photos',
      'Small crossbody bag for daily outings',
      'Any personal medications',
    ],
  ),
  buildChecklist(
    "Jovi's bag",
    'Personal essentials for Jovi',
    [
      'Passport (6+ months validity)',
      'Comfortable walking shoes',
      'Light layers for Madrid evenings',
      'Sunscreen & sunglasses',
      'Toiletries (100ml liquids in clear bag)',
      'Phone + eSIM / roaming plan confirmed',
      'Wallet with cards & some euros',
      'Any personal medications',
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
