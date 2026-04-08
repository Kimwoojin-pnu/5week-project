CHAPTERS_DATA = [
    {
        "id": 1,
        "title": "Regularization",
        "description": "L1/L2 규제, Dropout, BatchNorm으로 과적합 방지",
        "is_free": True,
        "order": 1,
        "content": """## Regularization이란?

Regularization(규제)은 모델이 훈련 데이터에 **과적합(overfitting)**되는 것을 방지하는 기법입니다.

### L1 규제 (Lasso)

L1 규제는 가중치의 절댓값 합을 손실 함수에 추가합니다.

```python
from tensorflow import keras

model = keras.Sequential([
    keras.layers.Dense(64, activation='relu',
                       kernel_regularizer=keras.regularizers.l1(0.01)),
    keras.layers.Dense(10, activation='softmax')
])
```

### L2 규제 (Ridge)

L2 규제는 가중치의 제곱합을 손실 함수에 추가합니다.

```python
model = keras.Sequential([
    keras.layers.Dense(64, activation='relu',
                       kernel_regularizer=keras.regularizers.l2(0.01)),
    keras.layers.Dense(10, activation='softmax')
])
```

### Dropout

훈련 중 랜덤하게 뉴런을 비활성화하여 과적합을 방지합니다.

```python
model = keras.Sequential([
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dropout(0.5),  # 50% 비활성화
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dropout(0.3),
    keras.layers.Dense(10, activation='softmax')
])
```

### Batch Normalization

각 미니배치의 활성화 값을 정규화하여 학습을 안정화시킵니다.

```python
model = keras.Sequential([
    keras.layers.Dense(128),
    keras.layers.BatchNormalization(),
    keras.layers.Activation('relu'),
    keras.layers.Dense(64),
    keras.layers.BatchNormalization(),
    keras.layers.Activation('relu'),
    keras.layers.Dense(10, activation='softmax')
])
```

### 비교 정리

| 기법 | 원리 | 효과 |
|------|------|------|
| L1 | 가중치 절댓값 패널티 | 희소한 가중치 생성 |
| L2 | 가중치 제곱 패널티 | 가중치를 작게 유지 |
| Dropout | 랜덤 뉴런 비활성화 | 앙상블 효과 |
| BatchNorm | 배치 정규화 | 안정적 학습, 빠른 수렴 |
""",
        "code_examples": [
            {
                "language": "python",
                "code": "# Dropout + L2 조합 예시\nmodel = keras.Sequential([\n    keras.layers.Dense(128, kernel_regularizer=keras.regularizers.l2(0.001)),\n    keras.layers.BatchNormalization(),\n    keras.layers.Activation('relu'),\n    keras.layers.Dropout(0.4),\n    keras.layers.Dense(10, activation='softmax')\n])",
                "caption": "Dropout과 L2 규제를 함께 사용하는 모범 예시"
            }
        ]
    },
    {
        "id": 2,
        "title": "Overfitting vs Underfitting",
        "description": "과적합과 과소적합을 진단하고 해결하는 방법",
        "is_free": True,
        "order": 2,
        "content": """## Overfitting vs Underfitting

### 개념 이해

| 문제 | 훈련 손실 | 검증 손실 | 원인 |
|------|-----------|-----------|------|
| Underfitting | 높음 | 높음 | 모델이 너무 단순 |
| Overfitting | 낮음 | 높음 | 모델이 너무 복잡 |
| 적절한 피팅 | 낮음 | 낮음 | 일반화 잘 됨 |

### 학습 곡선으로 진단

```python
import matplotlib.pyplot as plt

history = model.fit(X_train, y_train,
                    validation_data=(X_val, y_val),
                    epochs=100)

plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.title('학습 곡선')
plt.show()
```

### Early Stopping으로 과적합 방지

```python
from tensorflow.keras.callbacks import EarlyStopping

early_stop = EarlyStopping(
    monitor='val_loss',
    patience=10,       # 10 에포크 동안 개선 없으면 중지
    restore_best_weights=True
)

model.fit(X_train, y_train,
          validation_split=0.2,
          epochs=200,
          callbacks=[early_stop])
```

### 해결 방법 요약

**Underfitting 해결:**
- 모델 복잡도 증가 (레이어/뉴런 추가)
- 훈련 에포크 증가
- 규제 강도 감소

**Overfitting 해결:**
- 데이터 증강
- Dropout 추가
- L1/L2 규제 강화
- Early Stopping 사용
""",
        "code_examples": []
    },
    {
        "id": 3,
        "title": "Data Augmentation",
        "description": "훈련 데이터를 인위적으로 늘려 모델 성능 향상",
        "is_free": False,
        "order": 3,
        "content": """## Data Augmentation

데이터 증강은 기존 훈련 데이터를 변환하여 다양한 버전을 생성함으로써 모델의 일반화 성능을 높입니다.

### Keras ImageDataGenerator

```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

datagen = ImageDataGenerator(
    rotation_range=20,        # +-20도 회전
    width_shift_range=0.2,    # 수평 이동
    height_shift_range=0.2,   # 수직 이동
    horizontal_flip=True,     # 좌우 반전
    zoom_range=0.1,           # 확대/축소
    fill_mode='nearest'
)

# 실제 사용
train_generator = datagen.flow(X_train, y_train, batch_size=32)
model.fit(train_generator, epochs=50)
```

### tf.data를 이용한 증강

```python
import tensorflow as tf

def augment(image, label):
    image = tf.image.random_flip_left_right(image)
    image = tf.image.random_brightness(image, max_delta=0.1)
    image = tf.image.random_contrast(image, 0.9, 1.1)
    return image, label

train_ds = tf.data.Dataset.from_tensor_slices((X_train, y_train))
train_ds = train_ds.map(augment).batch(32).prefetch(tf.data.AUTOTUNE)
```
""",
        "code_examples": []
    },
    {
        "id": 4,
        "title": "Transfer Learning",
        "description": "사전 학습된 모델을 활용한 전이 학습",
        "is_free": False,
        "order": 4,
        "content": """## Transfer Learning

이미 대규모 데이터셋으로 학습된 모델의 가중치를 재활용하여 새로운 태스크에 적용합니다.

### Feature Extraction

```python
from tensorflow.keras.applications import VGG16
from tensorflow.keras import layers, Model

base_model = VGG16(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False  # 가중치 동결

inputs = base_model.input
x = base_model.output
x = layers.GlobalAveragePooling2D()(x)
x = layers.Dense(256, activation='relu')(x)
outputs = layers.Dense(10, activation='softmax')(x)

model = Model(inputs, outputs)
model.compile(optimizer='adam', loss='categorical_crossentropy', metrics=['accuracy'])
```

### Fine-tuning

```python
# 상위 레이어 일부 동결 해제
base_model.trainable = True
for layer in base_model.layers[:-4]:
    layer.trainable = False

model.compile(optimizer=tf.keras.optimizers.Adam(1e-5),  # 작은 학습률
              loss='categorical_crossentropy',
              metrics=['accuracy'])
```
""",
        "code_examples": []
    },
    {
        "id": 5,
        "title": "MNIST CNN 실습",
        "description": "CNN으로 손글씨 숫자 분류 전체 실습",
        "is_free": False,
        "order": 5,
        "content": """## MNIST CNN 실습

처음부터 끝까지 CNN 모델을 구축하고 훈련하는 완전한 실습입니다.

### 데이터 준비

```python
import tensorflow as tf
from tensorflow import keras
import numpy as np

# 데이터 로드
(X_train, y_train), (X_test, y_test) = keras.datasets.mnist.load_data()

# 정규화 및 reshape
X_train = X_train.reshape(-1, 28, 28, 1).astype('float32') / 255.0
X_test = X_test.reshape(-1, 28, 28, 1).astype('float32') / 255.0

# One-hot 인코딩
y_train = keras.utils.to_categorical(y_train, 10)
y_test = keras.utils.to_categorical(y_test, 10)
```

### CNN 모델 구성

```python
model = keras.Sequential([
    # Conv Block 1
    keras.layers.Conv2D(32, (3,3), activation='relu', input_shape=(28,28,1)),
    keras.layers.BatchNormalization(),
    keras.layers.MaxPooling2D(2,2),
    keras.layers.Dropout(0.25),

    # Conv Block 2
    keras.layers.Conv2D(64, (3,3), activation='relu'),
    keras.layers.BatchNormalization(),
    keras.layers.MaxPooling2D(2,2),
    keras.layers.Dropout(0.25),

    # FC Layers
    keras.layers.Flatten(),
    keras.layers.Dense(128, activation='relu'),
    keras.layers.Dropout(0.5),
    keras.layers.Dense(10, activation='softmax')
])

model.summary()
```

### 훈련

```python
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

history = model.fit(
    X_train, y_train,
    batch_size=128,
    epochs=10,
    validation_split=0.1,
    callbacks=[keras.callbacks.EarlyStopping(patience=3, restore_best_weights=True)]
)
```

### 평가

```python
test_loss, test_acc = model.evaluate(X_test, y_test, verbose=0)
print(f"테스트 정확도: {test_acc:.4f}")
# 기대 결과: ~99.2%
```
""",
        "code_examples": []
    },
]


def get_chapter_list():
    return [
        {
            "id": ch["id"],
            "title": ch["title"],
            "description": ch["description"],
            "is_free": ch["is_free"],
            "order": ch["order"],
        }
        for ch in CHAPTERS_DATA
    ]


def get_chapter_by_id(chapter_id: int):
    for ch in CHAPTERS_DATA:
        if ch["id"] == chapter_id:
            return ch
    return None
