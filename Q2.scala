//19001428

object Q2{
    def main(args:Array[String]):Unit = {
        val x = new Rational(3, 4)
        val y = new Rational(5, 8)
        val z = new Rational(2, 7)

        println(x.sub(y).sub(z))
    }
}

class Rational(x:Int, y:Int){

  private def gcd(x:Int, y:Int):Int = if(y == 0) x else gcd(y, x % y)

  private val g = gcd(Math.abs(x), Math.abs(y))
  val numer = x / g
  val denom = y / g

  def neg = new Rational(- this.numer, this.denom)
  
  def +(num:Rational):Rational = {
    new Rational(this.numer * num.denom + num.numer * this.denom, this.denom * num.denom)
  }

  def sub(num:Rational):Rational = {
    this + num.neg
  }

  override def toString = this.numer.toString + " / " + this.denom.toString
}