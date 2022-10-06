object Q1 extends App {
  def norSal(hours :Int) = hours*150
  def otSal(hours :Int): Int = hours*75
  def tax(sal :Double): Double = sal*0.1
  def fullSal(wH :Int,otH :Int): Double = norSal(wH)+otSal(otH)
  def takehomeSal(wH :Int,otH :Int): Double = fullSal(wH,otH)-tax(fullSal(wH,otH))
  print("Salary = "+takehomeSal(40,20))
}
