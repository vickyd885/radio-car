radio.setGroup(1)

let x = 0
let y = 0
let z = 0
let acc = ""
basic.forever(function () {
    x = input.acceleration(Dimension.X)
    y = input.acceleration(Dimension.Y)
    z = input.acceleration(Dimension.Z)
    acc = x + "," + y + "," + z
    radio.sendString(acc)
    basic.pause(100)
})


input.onButtonPressed(Button.A, function () {
    radio.sendString("A")
})

input.onButtonPressed(Button.B, function () {
    radio.sendString("B")
})

