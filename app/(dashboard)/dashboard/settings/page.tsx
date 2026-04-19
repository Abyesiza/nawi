import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { requireRole } from "@/lib/auth/current";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { encrypt, tryDecrypt } from "@/lib/crypto";
import { EditorShell, AsideTips } from "../../_components/editor-shell";

export default async function PrivacySettings() {
  const user = await requireRole("CLIENT");
  const current = tryDecrypt(user.contactValueEnc) ?? "";

  async function update(formData: FormData) {
    "use server";
    const u = await requireRole("CLIENT");
    const method = String(formData.get("contactMethod") ?? "NONE") as
      | "WHATSAPP"
      | "EMAIL"
      | "NONE";
    const value = String(formData.get("contactValue") ?? "").trim();
    await db
      .update(users)
      .set({
        contactMethod: method,
        contactValueEnc: method === "NONE" || !value ? null : encrypt(value),
        updatedAt: new Date(),
      })
      .where(eq(users.id, u.id));
    revalidatePath("/dashboard/settings");
  }

  return (
    <EditorShell
      eyebrow="Privacy"
      title="Communication Preferences"
      subtitle="Pick how (or whether) we may reach you. Stored encrypted at rest with AES-256-GCM."
      backHref="/dashboard"
      backLabel="Dashboard"
      aside={
        <AsideTips
          title="Privacy guarantees"
          tips={[
            "We never store your real name.",
            "Contact info is encrypted at rest and only decrypted to send you a message.",
            "Visible only to your assigned concierge — and only under their persona name.",
            "Set channel to None to silence all outbound notifications.",
          ]}
        />
      }
    >
      <form
        action={update}
        className="bg-white rounded-3xl border border-burgundy/5 p-6 sm:p-8 space-y-6"
      >
        <div className="space-y-3">
          <label className="block text-sm font-bold text-grey-dark">
            Channel
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(["WHATSAPP", "EMAIL", "NONE"] as const).map((m) => (
              <label
                key={m}
                className="cursor-pointer border-2 rounded-xl p-3 text-center text-sm font-bold has-[:checked]:border-burgundy has-[:checked]:bg-burgundy/5 has-[:checked]:text-burgundy border-grey-light text-grey-medium"
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value={m}
                  defaultChecked={user.contactMethod === m}
                  className="sr-only"
                />
                {m === "NONE" ? "None" : m.charAt(0) + m.slice(1).toLowerCase()}
              </label>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-bold text-grey-dark">
            Contact value
          </label>
          <input
            name="contactValue"
            defaultValue={current}
            placeholder="WhatsApp number with country code, or email address"
            className="w-full px-5 py-4 rounded-xl border border-grey-light focus:border-burgundy outline-none text-sm"
          />
          <p className="text-xs text-grey-medium">
            Leave blank if you chose &quot;None&quot;.
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-4 rounded-full bg-burgundy text-white font-bold shadow-lg hover:bg-burgundy-light"
        >
          Save Preferences
        </button>
      </form>
    </EditorShell>
  );
}
