-- Allow customers to see and claim guest orders placed with their email.

drop policy if exists "orders: owner read" on orders;

create policy "orders: owner read"
  on orders for select
  using (
    auth.uid() = user_id
    or (
      user_id is null
      and lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
    or (
      lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

create policy "orders: link guest by email"
  on orders for update
  using (
    user_id is null
    and lower(customer_email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  with check (user_id = auth.uid());
