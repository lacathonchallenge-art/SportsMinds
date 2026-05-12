import { notFound } from "next/navigation";
import { getEventById } from "@/lib/data/events";
import { EventForm } from "../../_components/EventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();
  return <EventForm mode="edit" initial={event} />;
}
