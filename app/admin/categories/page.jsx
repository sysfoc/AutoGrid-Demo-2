import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import Link from "next/link";

export default function Categories() {
  return (
    <div className="mt-10">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Blog Categories</h2>
        </div>
        <div>
          <Link
            href={"/admin/categories/add"}
            className="rounded-lg bg-yellow-500 p-3 text-sm text-white"
          >
            Add New
          </Link>
        </div>
      </div>
      <div className="mt-5">
        <Table>
          <TableHead>
            <TableHeadCell>Serial</TableHeadCell>
            <TableHeadCell>Name</TableHeadCell>
            <TableHeadCell>Slug</TableHeadCell>
            <TableHeadCell>Actions</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>1</TableCell>
              <TableCell>First Category</TableCell>
              <TableCell>first-slug</TableCell>
              <TableCell>
                <div className="flex items-center gap-x-5">
                  <Link
                    href="/admin/categories/edit/2"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </Link>
                  <Link
                    href="#"
                    className="font-medium text-red-500 hover:underline dark:text-red-500"
                  >
                    Delete
                  </Link>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>2</TableCell>
              <TableCell>Second Category</TableCell>
              <TableCell>second-slug</TableCell>
              <TableCell>
                <div className="flex items-center gap-x-5">
                  <Link
                    href="/admin/categories/edit/2"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </Link>
                  <Link
                    href="#"
                    className="font-medium text-red-500 hover:underline dark:text-red-500"
                  >
                    Delete
                  </Link>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>3</TableCell>
              <TableCell>Third Category</TableCell>
              <TableCell>third-slug</TableCell>
              <TableCell>
                <div className="flex items-center gap-x-5">
                  <Link
                    href="/admin/categories/edit/2"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </Link>
                  <Link
                    href="#"
                    className="font-medium text-red-500 hover:underline dark:text-red-500"
                  >
                    Delete
                  </Link>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>4</TableCell>
              <TableCell>Fourth Category</TableCell>
              <TableCell>fourth-slug</TableCell>
              <TableCell>
                <div className="flex items-center gap-x-5">
                  <Link
                    href="/admin/categories/edit/2"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </Link>
                  <Link
                    href="#"
                    className="font-medium text-red-500 hover:underline dark:text-red-500"
                  >
                    Delete
                  </Link>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>5</TableCell>
              <TableCell>Sliver</TableCell>
              <TableCell>Laptop</TableCell>
              <TableCell>
                <div className="flex items-center gap-x-5">
                  <Link
                    href="/admin/categories/edit/2"
                    className="font-medium text-cyan-600 hover:underline dark:text-cyan-500"
                  >
                    Edit
                  </Link>
                  <Link
                    href="#"
                    className="font-medium text-red-500 hover:underline dark:text-red-500"
                  >
                    Delete
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
