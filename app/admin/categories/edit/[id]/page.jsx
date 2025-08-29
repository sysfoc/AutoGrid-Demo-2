import { Button, Label, TextInput } from "flowbite-react";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Edit Categories</h2>
        </div>
        <div>
          <Link
            href={"/admin/categories"}
            className="rounded-lg bg-blue-500 p-3 text-sm text-white"
          >
            View All
          </Link>
        </div>
      </div>
      <div>
        <div>
          <form className="mt-8 flex flex-col gap-y-5">
            <div>
              <Label htmlFor="name">Name</Label>
              <TextInput id="name" placeholder="This is my first category" />
            </div>
            <div>
              <Label htmlFor="slug">Slug</Label>
              <TextInput id="slug" placeholder="This is my first category" />
            </div>
            <div>
              <Button color={"dark"} className="w-full">
                Update changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default page;
