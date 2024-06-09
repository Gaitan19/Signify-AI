import numpy as np
from keras.preprocessing.image import load_img, img_to_array
from keras.models import load_model

longitud, altura = 150, 150
modelo = './modelo/modelo.h5'
pesos_modelo = './modelo/pesos.weights.h5'
cnn = load_model(modelo)
cnn.load_weights(pesos_modelo)

def predict(file):
  x = load_img(file, target_size=(longitud, altura))
  x = img_to_array(x)
  x = np.expand_dims(x, axis=0)
  array = cnn.predict(x)
  result = array[0]
  answer = np.argmax(result)
  if answer == 0:
    print("pred: A")
  elif answer == 1:
    print("pred: B")
  elif answer == 2:
    print("pred: C")
  elif answer == 3:
    print("pred: D")
  elif answer == 4:
    print("pred: E")
  elif answer == 5:
    print("pred: F")
  elif answer == 6:
    print("pred: G")
  elif answer == 7:
    print("pred: H")
  elif answer == 8:
    print("pred: I")
  elif answer == 9:
    print("pred: K")
  elif answer == 10:
    print("pred: L")
  elif answer == 11:
    print("pred: M")
  elif answer == 12:
    print("pred: N")
  elif answer == 13:
    print("pred: O")
  elif answer == 14:
    print("pred: P")
  elif answer == 15:
    print("pred: Q")
  elif answer == 16:
    print("pred: R")
  elif answer == 17:
    print("pred: S")
  elif answer == 18:
    print("pred: T")
  elif answer == 19:
    print("pred: U")
  elif answer == 20:
    print("pred: V")
  elif answer == 21:
    print("pred: W")
  elif answer == 22:
    print("pred: X")
  elif answer == 23:
    print("pred: Y")
  return answer


# predict('./data/validacion/L/L1.jpg')
predict('example3.jpeg')
