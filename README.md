Why there’s no loading spinner on initial server-side render:

On a server-side rendered (SSR) page, the HTML is generated on the server before it ever reaches the browser. At that moment, there’s no React state yet on the client, so you cannot show a spinner while fetching server-side data — the server already waited for the data to render the page.

The spinner only makes sense for client-side interactions (like deleting items or re-fetching the list on focus/online), because that’s when React state exists in the browser and can represent a “loading” condition.

So in this app:

The initial product list is rendered fully on the server (SSR). No spinner is needed.

The spinner is only shown after the page loads when the client fetches updated data or deletes items.

Why deleted items are handled with localStorage:

In a real-world application, deletions would be sent to a server, which would return an up-to-date list excluding deleted items. That way, every client would see the same list and it would persist across sessions.

In this demo, there’s no backend to persist deletions. Instead, localStorage is used to remember which products were deleted by this client. When the page reloads or the list is refreshed (e.g., tab regains focus or comes back online), the app filters out the locally deleted items so the UI behaves as if the items were truly removed.