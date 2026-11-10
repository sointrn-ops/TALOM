begin;

create or replace function public.create_store_order(
  p_customer_name text,
  p_phone text,
  p_address text,
  p_items jsonb
)
returns uuid
language plpgsql
security invoker
set search_path to ''
as $function$
begin
  return private.create_order_internal(
    p_customer_name,
    p_phone,
    p_address,
    p_items
  );
end;
$function$;

drop policy if exists "Customers can create their own orders" on public.orders;
drop policy if exists "Customers can add items to their own orders" on public.order_items;

commit;
