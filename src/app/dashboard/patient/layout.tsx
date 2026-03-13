import DashboardLayout from '../../../components/dashboard/DashboardLayout';

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
