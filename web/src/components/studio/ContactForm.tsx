"use client";

import { FormEvent, useState } from "react";
import { STUDIO_EMAIL } from "@/data/studio";

export function ContactForm() {
  const [opened, setOpened] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const project = String(data.get("project") || "").trim();
    const note = String(data.get("note") || "").trim();
    const subject = encodeURIComponent(`Project inquiry — ${project || name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nProject: ${project}\n\n${note}`,
    );
    setOpened(true);
    window.location.href = `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <form className="desk-form" onSubmit={onSubmit}>
      <label>
        <span>Name</span>
        <input name="name" type="text" autoComplete="name" required maxLength={120} />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required maxLength={160} />
      </label>
      <label>
        <span>Working title</span>
        <input name="project" type="text" required maxLength={160} placeholder="The game, in a few words" />
      </label>
      <label>
        <span>What you need</span>
        <textarea name="note" required rows={5} maxLength={4000} placeholder="Where the game is, and what you want Emris to do." />
      </label>
      <button type="submit" className="btn btn-primary">
        Send the note
      </button>
      {opened ? (
        <p className="desk-note" role="status">
          Your mail app should be open, addressed to the studio. If it did not,
          write to <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>.
        </p>
      ) : (
        <p className="desk-note">
          This opens your email app, addressed to{" "}
          <a href={`mailto:${STUDIO_EMAIL}`}>{STUDIO_EMAIL}</a>.
        </p>
      )}
    </form>
  );
}
