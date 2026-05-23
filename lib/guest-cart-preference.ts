const GUEST_ACK_KEY = 'dubiken_guest_cart_ack';

export function hasGuestCartAck(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(GUEST_ACK_KEY) === '1';
  } catch {
    return false;
  }
}

export function setGuestCartAck(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.setItem(GUEST_ACK_KEY, '1');
  } catch {
    /* ignore */
  }
}
