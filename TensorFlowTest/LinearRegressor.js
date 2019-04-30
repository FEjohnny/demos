// 使用 TensorFlow.js 进行预测
import * as tf from '@tensorflow/tfjs';

export default class LinearModel {
...trainingCode

    predict(value){
        return Array.from(
            this.linearModel
                .predict(tf.tensor2d([value], [1, 1]))
                .dataSync()
        )
    }
}