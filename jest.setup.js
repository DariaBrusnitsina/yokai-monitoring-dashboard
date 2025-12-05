import '@testing-library/jest-dom'

// Mock window.alert
global.alert = jest.fn()

// Polyfill for Request (needed for Next.js API routes in tests)
if (typeof global.Request === 'undefined') {
  global.Request = class Request {
    constructor(input, init = {}) {
      this.url = typeof input === 'string' ? input : input.url
      this.method = init.method || 'GET'
      this.headers = new Headers(init.headers)
      this.signal = init.signal || null
    }
  }
}

// Polyfill for Headers
if (typeof global.Headers === 'undefined') {
  global.Headers = class Headers {
    constructor(init = {}) {
      this._headers = {}
      if (init) {
        Object.entries(init).forEach(([key, value]) => {
          this._headers[key.toLowerCase()] = value
        })
      }
    }
    get(name) {
      return this._headers[name.toLowerCase()] || null
    }
    set(name, value) {
      this._headers[name.toLowerCase()] = value
    }
  }
}

// Polyfill for Response
if (typeof global.Response === 'undefined') {
  class Response {
    constructor(body, init = {}) {
      this.body = body
      this.status = init.status || 200
      this.statusText = init.statusText || 'OK'
      this.headers = new Headers(init.headers)
      this.ok = this.status >= 200 && this.status < 300
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    }

    async text() {
      return typeof this.body === 'string' ? this.body : JSON.stringify(this.body)
    }

    static json(data, init = {}) {
      return new Response(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init.headers,
        },
      })
    }
  }
  global.Response = Response
}

// Mock EventSource for SSE tests
global.EventSource = class EventSource {
  constructor(url) {
    this.url = url
    this.onmessage = null
    this.onerror = null
    this.readyState = 1 // OPEN
  }

  close() {
    this.readyState = 2 // CLOSED
  }
}

