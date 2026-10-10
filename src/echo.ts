import Echo from 'laravel-echo'
import Pusher from 'pusher-js'

declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}

window.Pusher = Pusher

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL
const authUrl = `${apiBaseUrl!.replace(/\/api\/?$/, '')}/broadcasting/auth`

const echo = new Echo({
  broadcaster: 'reverb',
  key: import.meta.env.VITE_REVERB_APP_KEY,
  wsHost: import.meta.env.VITE_REVERB_HOST,
  wsPort: Number(import.meta.env.VITE_REVERB_PORT),
  wssPort: Number(import.meta.env.VITE_REVERB_PORT),
  forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
  enabledTransports: ['ws', 'wss'],

  authorizer: (channel: { name: string }) => ({
    authorize: (
      socketId: string,
      callback: (error: Error | null, data: any) => void,
    ) => {
      const token = localStorage.getItem('token')

      // No token = the request can never authenticate; fail fast.
      if (!token) {
        callback(new Error('Broadcast auth skipped: no auth token'), null)
        return
      }

      fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          socket_id: socketId,
          channel_name: channel.name,
        }),
      })
        .then(async (res) => {
          if (!res.ok) {
            throw new Error(`Broadcast auth failed (${res.status})`)
          }

          let json: any = null
          try {
            json = JSON.parse(await res.text())
          } catch {
            /* not JSON */
          }

          // A 200 without { auth: "<key>:<signature>" } is not a successful auth.
          if (!json?.auth) {
            throw new Error('Broadcast auth returned no signature')
          }

          return json
        })
        .then((data) => callback(null, data))
        .catch((err) => callback(err, null))
    },
  }),
})

export default echo