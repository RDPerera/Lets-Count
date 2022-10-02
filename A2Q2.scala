object Q2 extends App {
  def attendees(ticketPrice :Double):Double = 120-(ticketPrice-15)*4
  def income(ticketPrice :Double): Double = attendees(ticketPrice)*ticketPrice
  def cost(ticketPrice :Double): Double = 500+3*attendees(ticketPrice)
  def profit(ticketPrice :Double): Double =income(ticketPrice)-cost(ticketPrice)

  print(profit(5),profit(10),profit(15),profit(20),profit(25),profit(30),profit(35),profit(40),profit(45))
}
