import type { CSSProperties } from "react";
import { useGameSession } from "../hooks/useGameSession";

const panelStyle: CSSProperties = {
  marginBottom: "1.5rem",
  padding: "1rem",
  border: "1px solid #d1d5db",
  borderRadius: "12px",
  background: "#ffffff",
};

const buttonRowStyle: CSSProperties = {
  display: "flex",
  gap: "0.75rem",
  flexWrap: "wrap",
};

const buttonStyle: CSSProperties = {
  padding: "0.65rem 0.9rem",
  borderRadius: "10px",
  border: "1px solid #d1d5db",
  background: "#f9fafb",
  cursor: "pointer",
};

export default function GameScreen() {
  const {
    session,
    lastResponse,
    error,
    availableMoves,
    visibleNpcs,
    inventoryItems,
    performAction,
    resetSession,
  } = useGameSession();

  const currentLocation = session.world.locations[session.player.locationId];

  return (
    <div style={{ padding: "2rem", maxWidth: "960px", margin: "0 auto" }}>
      <h1 style={{ marginBottom: "0.25rem" }}>cf_ai_game_master</h1>
      <p style={{ marginTop: 0, color: "#4b5563" }}>Debug play screen</p>

      <section style={panelStyle}>
        <h2>Player</h2>
        <p>
          <strong>Name:</strong> {session.player.name}
        </p>
        <p>
          <strong>Class:</strong> {session.player.archetype}
        </p>
        <p>
          <strong>Health:</strong> {session.player.stats.health}/
          {session.player.stats.maxHealth}
        </p>
        <p>
          <strong>Stamina:</strong> {session.player.stats.stamina}/
          {session.player.stats.maxStamina}
        </p>
        <p>
          <strong>Turn:</strong> {session.currentTurn}
        </p>
      </section>

      <section style={panelStyle}>
        <h2>Current Location</h2>
        <p>
          <strong>Name:</strong> {currentLocation?.name ?? "Unknown"}
        </p>
        <p>
          <strong>Danger:</strong> {currentLocation?.dangerRating ?? "?"}
        </p>
        <p>
          <strong>Discovered:</strong> {currentLocation?.discovered ? "Yes" : "No"}
        </p>
        <p>
          <strong>Visible NPCs:</strong> {currentLocation?.visibleNpcIds.length ?? 0}
        </p>
        <p>
          <strong>Connected Locations:</strong> {availableMoves.length}
        </p>
      </section>

      <section style={panelStyle}>
        <h2>Last Response</h2>
        <div
          style={{
            padding: "1rem",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            minHeight: "80px",
            background: "#f9fafb",
          }}
        >
          <p style={{ marginTop: 0 }}>
            {lastResponse?.narrativeText ?? "No actions taken yet."}
          </p>
          {error ? (
            <p style={{ color: "crimson", marginBottom: 0 }}>
              <strong>Error:</strong> {error}
            </p>
          ) : null}
        </div>
      </section>

      <section style={panelStyle}>
        <h2>Quick Actions</h2>
        <div style={buttonRowStyle}>
          <button style={buttonStyle} onClick={() => performAction({ type: "inspect" })}>
            Inspect
          </button>

          <button style={buttonStyle} onClick={() => performAction({ type: "rest" })}>
            Rest
          </button>

          <button
            style={buttonStyle}
            onClick={() => performAction({ type: "meta", command: "status" })}
          >
            Status
          </button>

          <button
            style={buttonStyle}
            onClick={() => performAction({ type: "meta", command: "recap" })}
          >
            Recap
          </button>

          <button
            style={buttonStyle}
            onClick={() => performAction({ type: "meta", command: "help" })}
          >
            Help
          </button>

          <button style={buttonStyle} onClick={resetSession}>
            Reset Session
          </button>
        </div>
      </section>

      <section style={panelStyle}>
        <h2>Move</h2>
        {availableMoves.length === 0 ? (
          <p>No connected locations.</p>
        ) : (
          <div style={buttonRowStyle}>
            {availableMoves.map((location) => (
              <button
                style={buttonStyle}
                key={location.id}
                onClick={() =>
                  performAction({
                    type: "move",
                    destinationId: location.id,
                  })
                }
              >
                {location.name}
              </button>
            ))}
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <h2>Talk</h2>
        {visibleNpcs.length === 0 ? (
          <p>No visible NPCs here.</p>
        ) : (
          <div style={buttonRowStyle}>
            {visibleNpcs.map((npc) => (
              <button
                style={buttonStyle}
                key={npc.id}
                onClick={() =>
                  performAction({
                    type: "talk",
                    targetNpcId: npc.id,
                  })
                }
              >
                Talk to {npc.name} ({npc.role})
              </button>
            ))}
          </div>
        )}
      </section>

      <section style={panelStyle}>
        <h2>Inventory</h2>
        {inventoryItems.length === 0 ? (
          <p>No items.</p>
        ) : (
          <ul>
            {inventoryItems.map((item) => (
              <li key={item.id}>
                <strong>{item.name}</strong> - {item.rarity}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={panelStyle}>
        <h2>Event Log</h2>
        <div
          style={{
            padding: "1rem",
            border: "1px solid #e5e7eb",
            borderRadius: "8px",
            background: "#f9fafb",
          }}
        >
          <ul style={{ margin: 0, paddingLeft: "1.25rem" }}>
            {session.eventLog.map((event) => (
              <li key={event.id}>
                <strong>[Turn {event.turn}]</strong> {event.type}: {event.message}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
