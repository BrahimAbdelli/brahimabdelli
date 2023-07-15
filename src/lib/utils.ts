export function copyTextAtClipBoard(text: string) {
  if (
    !document.queryCommandSupported &&
    document.queryCommandSupported('copy')
  ) {
    return false;
  }
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.top = '0';
  textarea.style.left = '0';
  textarea.style.position = 'fixed';
  document.body.appendChild(textarea);
  // focus() -> Safari browser support
  textarea.focus();
  // select() -> Required when setting the area with the contents entered by the user
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);

  return true;
}
