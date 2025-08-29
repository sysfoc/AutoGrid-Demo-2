"use client";
import React, { Suspense, useState } from "react";
import dynamic from "next/dynamic";
import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";

const LazyJoditEditor = dynamic(() => import("jodit-react"), { ssr: false });

export default function Page() {
  const [content, setContent] = useState("");

  const config = {
    readonly: false,
    placeholder: "Start typing...",
    height: 500,
  };

  return (
    <section className="my-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edit Email</h2>
        </div>
        <div>
          <Link
            href={"/admin/emails/view"}
            className="rounded-lg bg-blue-500 p-3 text-sm text-white"
          >
            View All
          </Link>
        </div>
      </div>
      <div>
        <form className="mt-5 flex flex-col gap-y-5">
          <div>
            <Label htmlFor="subject">Subject:</Label>
            <TextInput id="subject" placeholder="Contact Form Title" />
          </div>
          <div>
            <p className="text-sm">Content:</p>
            <Suspense fallback={<p>Loading editor...</p>}>
              <LazyJoditEditor
                config={config}
                tabIndex={1}
                onBlur={(newContent) => setContent(newContent)}
                onChange={() => {}}
              />
            </Suspense>
          </div>
          <div className="mt-5 flex flex-col">
            <Button color="dark">Update</Button>
          </div>
        </form>
      </div>
    </section>
  );
}
