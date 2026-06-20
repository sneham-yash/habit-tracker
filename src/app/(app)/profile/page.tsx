import { ProfilePage } from "@/components/profile/profile-page";
import { formatDisplayDate } from "@/lib/dates";
import { createClient } from "@/lib/supabase/server";

function formatMemberSince(dateString: string): string {
  return formatDisplayDate(dateString.split("T")[0]!, {
    month: "long",
    year: "numeric",
  });
}

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("display_name, avatar_url, created_at")
        .eq("id", user.id)
        .maybeSingle()
    : { data: null };

  const profileData = profile as {
    display_name: string | null;
    avatar_url: string | null;
    created_at: string;
  } | null;

  return (
    <ProfilePage
      email={user?.email ?? ""}
      displayName={profileData?.display_name ?? null}
      avatarUrl={profileData?.avatar_url ?? null}
      memberSince={
        profileData?.created_at
          ? formatMemberSince(profileData.created_at)
          : "Recently"
      }
    />
  );
}
