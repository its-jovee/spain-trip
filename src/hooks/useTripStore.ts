import { useEffect, useSyncExternalStore } from 'react'
import { tripStore } from '../lib/store'

export function useTripStore() {
  const snapshot = useSyncExternalStore(
    (cb) => tripStore.subscribe(cb),
    () => ({
      events: tripStore.getEvents(),
      documents: tripStore.getDocuments(),
      checklists: tripStore.getChecklists(),
    }),
  )

  useEffect(() => {
    void tripStore.init()
  }, [])

  return {
    ...snapshot,
    addEvent: tripStore.addEvent.bind(tripStore),
    updateEvent: tripStore.updateEvent.bind(tripStore),
    deleteEvent: tripStore.deleteEvent.bind(tripStore),
    reorderEvents: tripStore.reorderEvents.bind(tripStore),
    moveEvent: tripStore.moveEvent.bind(tripStore),
    toggleChecklistItem: tripStore.toggleChecklistItem.bind(tripStore),
    addDocument: tripStore.addDocument.bind(tripStore),
  }
}
