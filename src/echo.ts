import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT),
  forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],

  // runs every time a private channel is joined, so it always uses the current token
  authorizer: (channel: { name: string }) => ({
    authorize: (
      socketId: string,
      callback: (error: Error | null, data: any) => void,
    ) => {
      fetch('http://127.0.0.1:8000/broadcasting/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ socket_id: socketId, channel_name: channel.name }),
      })
        .then((res) => {
          if (!res.ok) throw new Error(`Broadcast auth failed (${res.status})`)
          return res.json()
        })
        .then((data) => callback(null, data))
        .catch((err) => callback(err, null))
    },
  }),
})

export default echo