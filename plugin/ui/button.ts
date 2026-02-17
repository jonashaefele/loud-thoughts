import { ButtonComponent } from 'obsidian'

export function withConfirm(callback: (btn: ButtonComponent) => void) {
  let onClickHandler: ((evt?: MouseEvent) => void) | undefined = undefined
  let resetButtonClicked = false
  return (btn: ButtonComponent) => {
    btn.setWarning().onClick(() => {
      if (!resetButtonClicked) {
        resetButtonClicked = true
        btn.setButtonText('Confirm')
        return
      }
      if (onClickHandler !== undefined) {
        onClickHandler()
      }
    })
    btn.onClick = (handler: (evt: MouseEvent) => void) => {
      onClickHandler = handler
      return btn
    }
    callback(btn)
  }
}
