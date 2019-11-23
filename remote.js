/* Code to write onto the Microbit for remote control.
 *
 * Simply sends acceleration on the x-axis, and strings "A", "B"
 * for left, right button presses respectively.
 */

radio.setGroup(1)

let x = 0
basic.forever(function () {
    x = input.acceleration(Dimension.X)
    radio.sendString(x.toString())
    basic.pause(10)
})

input.onButtonPressed(Button.A, function () {
    radio.sendString("A")
})

input.onButtonPressed(Button.B, function () {
    radio.sendString("B")
})
