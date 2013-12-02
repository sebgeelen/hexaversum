== TODO ==

* custom event namespace

* build the invasion rules
  - the politics lower when invade due to people disapointements, exept if your specialized in atk or def
  - the food lower due to the troups need
  - the science raise a little due to the stolen technologies of the enemy; raise more if specialize
  - if the science is hight enouph you might be abble to stole and concerv some food from enemy ( see enemy food)
  - the money might be an option to buy the enemy and so lower the maluses
  - the money could raise if science = hight, bacause you resell the stole ships from enemy, if victory of course
  - diferent malus / bonus if you atk a special kind of planet : meaning ue or wild.
  - bonus if you allready own all the planet around even if not linked
  - low chance of infiltration if specialised in science and hight science resource
  - low chance of give up from enemy population if specialized in politics and hight in money = loose A LOT of money
    cause you pay the people, but no malus on other res

* reset specialization when planet grow ???

* game enemy; entropy or IA?

* multiplayer ??
  - owned diferent planet at begining, over socket, wait for end of other player turn?


--------------------------------------------------------------------------------------------

== DONE ==

* each action trigger next turn

  - on next turn : every resurces grown => res += (res / 10) * (random * planetSize / 2 ) + planetSize / 2 + 1
  - if the planet reach planetSize * 10 < (food * science / 3) + (money / 3) + ( politics / 4 )
