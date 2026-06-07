-- Improve profile full_name extraction for OAuth providers (Google, Apple, etc.)
create or replace function public.extract_user_full_name(meta jsonb)
returns text
language sql
immutable
as $$
  select nullif(
    trim(
      coalesce(
        nullif(meta ->> 'full_name', ''),
        nullif(
          trim(
            concat_ws(
              ' ',
              nullif(meta ->> 'given_name', ''),
              nullif(meta ->> 'family_name', '')
            )
          ),
          ''
        )
      )
    ),
    ''
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, public.extract_user_full_name(new.raw_user_meta_data));
  return new;
end;
$$;
