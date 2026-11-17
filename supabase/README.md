# Supabase setup

Questo uses Supabase Auth and PostgreSQL for accounts, profiles, companies, and company memberships. Google Sheets remains an optional connector for existing operational workflows.

1. Create a Supabase project and apply `migrations/202611180001_core_identity.sql` in the SQL editor.
2. Disable public sign-ups in **Authentication → Settings**. Invite each employee from the Supabase dashboard; the database trigger creates their profile.
3. Create a company and assign its first CEO membership in the SQL editor, replacing the three example values:

   ```sql
   do $$
   declare company_uuid uuid;
   declare owner_uuid uuid;
   begin
     insert into public.companies (name, slug)
     values ('Example Company', 'example-company')
     returning id into company_uuid;

     select id into owner_uuid from public.profiles
     where email = lower('owner@example.com');
     if owner_uuid is null then raise exception 'Invite this owner before provisioning the company'; end if;

     insert into public.company_memberships (company_id, user_id, role)
     values (company_uuid, owner_uuid, 'CEO');
   end $$;
   ```

4. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the project's API settings to the frontend deployment environment. The publishable/anon key is intended for the browser; never put the service-role key there.
5. Set `OPENROUTER_API_KEY`, `AI_MODEL=deepseek/deepseek-flash`, and a strong random `QUESTO_AUTH_TOKEN` in Apps Script **Project Settings → Script Properties**. Set the matching `QUESTO_AUTH_TOKEN` in the n8n environment used by the imported workflows. Create an OpenRouter credential in n8n and attach it to each imported OpenRouter Chat Model node. Do not put any of these values in Sheets or frontend settings.

The app login now rejects accounts without a company membership. Existing task, standup, leave, recruiting, and employee-roster screens still use local mock data and/or the legacy Apps Script/Sheets services; those records have not yet been migrated into tenant-scoped PostgreSQL tables. Do not treat those operational records or the employee roster as production multi-tenant storage until that migration is complete.
