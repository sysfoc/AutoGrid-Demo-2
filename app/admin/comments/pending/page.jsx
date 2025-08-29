import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

export default function Pending() {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold">Pending Comments</h2>
      <div className="mt-5">
        <Table>
          <TableHead>
            <TableHeadCell>Email</TableHeadCell>
            <TableHeadCell>Comment</TableHeadCell>
            <TableHeadCell>Blog Title</TableHeadCell>
            <TableHeadCell>Action</TableHeadCell>
          </TableHead>
          <TableBody className="divide-y">
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>hamza@gmail.com</TableCell>
              <TableCell>This Is My First Comment</TableCell>
              <TableCell>Sports</TableCell>
              <TableCell>
                <div className="flex items-center gap-x-5">
                  <Button color={"success"} size={"sm"}>
                    Approve
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>hamza@gmail.com</TableCell>
              <TableCell>This Is My Second Comment</TableCell>
              <TableCell>Sports</TableCell>
              <TableCell>
                <div className="flex items-center gap-x-5">
                  <Button color={"success"} size={"sm"}>
                    Approve
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>hamza@gmail.com</TableCell>
              <TableCell>This Is My Third Comment</TableCell>
              <TableCell>Sports</TableCell>
              <TableCell>
                <div className="flex items-center gap-x-5">
                  <Button color={"success"} size={"sm"}>
                    Approve
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <TableCell>hamza@gmail.com</TableCell>
              <TableCell>This Is My Fourth Comment</TableCell>
              <TableCell>Sports</TableCell>
              <TableCell>
                <div className="flex items-center gap-x-5">
                  <Button color={"success"} size={"sm"}>
                    Approve
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
