import UserRow from './UserRow';

interface Props {
  users: any[];
  refresh: () => void;
}

export default function UserTable({
  users,
  refresh,
}: Props) {
  return (
    <div className="overflow-x-auto rounded-xl bg-white shadow">
      <table className="w-full">
        <thead className="bg-slate-100">
          <tr>
            <th className="p-4 text-left">
              Name
            </th>

            <th className="text-left">
              Email
            </th>

            <th className="text-left">
              Role
            </th>

            <th className="text-left">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <UserRow
              key={user._id}
              user={user}
              refresh={refresh}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}