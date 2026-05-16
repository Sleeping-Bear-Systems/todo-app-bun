pipeline {
    agent none
    stages {
        stage('Build & Test') {
            agent {
                docker {
                    image 'oven/bun:1.3.14'
                }
            }
            steps {
                script {
                    sh 'bun install --frozen-lockfile'
                    sh 'bun run ts:check'
                    sh 'bun run biome:ci'
                    sh 'bun test'
                }
            }
        }
    }
}
