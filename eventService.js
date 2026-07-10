// eventService.js

import { db } from "./firebase.js";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  deleteDoc,
  increment,
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

// Firestore Collection
const eventsCollection = collection(db, "events");

/**
 * Get all events
 */
export async function getAllEvents() {
  try {
    const snapshot = await getDocs(eventsCollection);

    const events = snapshot.docs.map((doc) => ({
      firestoreId: doc.id,
      ...doc.data(),
    }));

    return events;
  } catch (error) {
    console.error("Error getting events:", error);
    return [];
  }
}

/**
 * Get event by custom Event ID (EVT001, EVT002...)
 */
export async function getEventById(eventId) {
  try {
    const q = query(eventsCollection, where("id", "==", eventId));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return null;
    }

    const docSnap = snapshot.docs[0];

    return {
      firestoreId: docSnap.id,
      ...docSnap.data(),
    };
  } catch (error) {
    console.error("Error getting event:", error);
    return null;
  }
}

/**
 * Add New Event
 */
export async function addNewEvent(event) {
  try {
    const docRef = await addDoc(eventsCollection, event);

    console.log("Event Added Successfully");

    return docRef.id;
  } catch (error) {
    console.error("Error adding event:", error);
    return null;
  }
}

/**
 * Update Event
 */
export async function updateEventDetails(eventId, updatedData) {
  try {
    const q = query(eventsCollection, where("id", "==", eventId));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("Event not found");
      return false;
    }

    const firestoreDoc = snapshot.docs[0];

    await updateDoc(firestoreDoc.ref, updatedData);

    console.log("Event Updated");

    return true;
  } catch (error) {
    console.error("Error updating event:", error);
    return false;
  }
}

/**
 * Delete Event
 */
export async function removeEvent(eventId) {
  try {
    const q = query(eventsCollection, where("id", "==", eventId));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("Event not found");
      return false;
    }

    const firestoreDoc = snapshot.docs[0];

    await deleteDoc(firestoreDoc.ref);

    console.log("Event Deleted");

    return true;
  } catch (error) {
    console.error("Error deleting event:", error);
    return false;
  }
}

/**
 * Increase Registration Count
 */
export async function incrementRegistration(eventId) {
  try {
    const q = query(eventsCollection, where("id", "==", eventId));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("Event not found");
      return false;
    }

    const firestoreDoc = snapshot.docs[0];

    await updateDoc(firestoreDoc.ref, {
      registeredCount: increment(1),
    });

    console.log("Registration Updated");

    return true;
  } catch (error) {
    console.error("Error updating registration:", error);
    return false;
  }
}