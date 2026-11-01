const form=document.querySelector('#appointment');
const result=document.querySelector('#response');
let pending;
form.addEventListener('submit',async event=>{
  event.preventDefault();
  const button=form.querySelector('button');
  if(button.disabled)return;
  const values=Object.fromEntries(new FormData(form));
  values.contact=values.contact.trim();
  const key=JSON.stringify(values);
  if(pending?.key!==key)pending={key,id:crypto.randomUUID()};
  button.disabled=true;
  result.textContent='Отправляем заявку…';
  try {
    const response=await fetch(form.action,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...values,id:pending.id})});
    const body=await response.json();
    if(!response.ok || body.id!==pending.id)throw new Error(body.error||'Не удалось отправить заявку.');
    result.textContent='Заявка принята. Владелец сайта свяжется с вами, чтобы согласовать время.';
    form.reset();
    pending=null;
  }catch(error){result.textContent=error instanceof TypeError?'Сервер недоступен. Данные сохранены в форме, попробуйте ещё раз.':error.message}
  finally{button.disabled=false}
});
