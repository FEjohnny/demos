import * as tf from '@tensorflow/tfjs';

/**
 * Linear model class
 */
export default class LinearModel {
    // 训练
    async trainModel(xs, ys) {
        const layers = tf.layers.dense({
            units: 1, // Dimensionality of the output space
            inputShape: [1], // Only one param
        });
        const lossAndOptimizer = {
            loss: 'meanSquaredError',
            optimizer: 'sgd', // Stochastic gradient descent
        };

        this.linearModel = tf.sequential();
        this.linearModel.add(layers); // Add the layer
        this.linearModel.compile(lossAndOptimizer);

        // Start the model training!
        await this.linearModel.fit(
            tf.tensor1d(xs),
            tf.tensor1d(ys),
        );
    }

    // 预测
    predict(value) {
        return Array.from(
            this.linearModel
                .predict(tf.tensor2d([value], [1, 1]))
                .dataSync()
        )
    }

//   ...more
}