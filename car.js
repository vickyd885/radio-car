/* Code for the car which recieves commands from the remote.
 *
 * The car responds to two commands
 * - Left Button Press (which acts like a toggle between going forward and backwards)
 * - Right Button Press (which stops or starts the robot and makes a buzzing sound)
 * If activated, car continues in the direction of travel, steering left or right
 * depending on the accelerometer of the remote Microbit.
 *
 * The mathematics of the steering mechanism is described in the code below.
 */


radio.setGroup(1)

let ax = 0
let moving = true
let forward = true
let speedRight = 0
let speedLeft = 0
let motorRotation = maqueen.Dir.CW

function getRotation(dir: boolean) {
    return dir ? maqueen.Dir.CW : maqueen.Dir.CCW;
}

radio.onReceivedString(function (receivedString: string) {
    if (receivedString == "A") {
        forward = !forward
    } else if (receivedString == "B") {
        moving = !moving
        if (!moving) {
            maqueen.motorStopAll()
            music.playTone(Note.C, 100)
            basic.pause(1000)
        }
    } else {
        if (!moving) return;

        ax = parseInt(receivedString)
        /*
         * ax is the tilt of the controller, which ranges from 
         * -1023 (Left) to 1023 (Right). 
         * 
         * The MotorRun command take 3 params: 
         * - which motor to spin, (M1 or M2)
         * - which direction to spin it in ( CC or CCW )
         * - speed ( acceptable range 0:100 )
         *
         * We are able to achieve simple proportional steering through some very
         * clever maths (no if statement hell!)
         * 
         * Idea:
         *
         * Steering thats porpotional to ax can be achieved by spinning one wheel
         * faster than the other, in either direction for left or righ - one just
         * needs to work out how much _more_ to spin one wheel than the other.
         * 
         * 
         * For example, if the user tilts it completely left, ax is -1023, then we
         * want to spin the left wheel _as little as possible_ i.e 0 but spin the right
         * motor as much as possible, i.e 100
         * 
         * The reverse is true if the user tilts completely right, if ax is 1023, then
         * the right motors needs to have no speed (0), whilst the left motor needs as
         * as possible (100)
         *
         * For any ax value inbetween the two extremes we simply adjust both speeds
         * accordingly.
         *
         * Maths:
         * 
         * For the left motor speed simply map ax to 0 - 100.
         * --> since ax can be from -1023 to 1023, we use that as the current range,
         *     this we map to the motor speed (0 - 100)
         *
         * For the right motor speed, subtract ax from the max value which is 1023.
         * --> 1023 - ax ranges from 0 to 2046 so that becomes our new range,
         *     this we map to the motor speed (0 - 100)
         * 
         * You'll notice that if the user tilts completely right, the value (1023 - ax)
         * becomes 0 and so the right motor does not spin at all, whilst for the left
         * motor spins at 100.
         * -> This method adapts for any intermediate value of ax.
         *
         * The example in which the user tits completely left is left to the user as
         * an exercise.
         *
         * Forwards/Backward toggle: 
         *
         * getRotation(direction) returns the required rotation depending if the user 
         * wants to go. The direction works seamlessy with the maths described above
         * to achieve realistic reverse motion.
         */

        speedLeft = Math.map(ax, -1023, 1023, 0, 100)
        speedRight = Math.map(1023 - ax, 0, 2046, 0, 100)

        motorRotation = getRotation(forward)

        maqueen.MotorRun(maqueen.aMotors.M1, motorRotation, speedLeft)
        maqueen.MotorRun(maqueen.aMotors.M2, motorRotation, speedRight)

    }
})
