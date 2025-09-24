// Base de dados de termos de IA
const termsDatabase = [
    {
        term: "Inteligência Artificial",
        definition: "Campo da ciência da computação que visa criar sistemas capazes de realizar tarefas que normalmente requerem inteligência humana."
    },
    {
        term: "Machine Learning",
        definition: "Subcampo da IA que permite que sistemas aprendam e melhorem automaticamente através da experiência, sem programação explícita."
    },
    {
        term: "Deep Learning",
        definition: "Técnica de machine learning que usa redes neurais artificiais com múltiplas camadas para processar dados e identificar padrões complexos."
    },
    {
        term: "LLM (Large Language Model)",
        definition: "Modelo de linguagem de grande escala treinado em vastas quantidades de texto para gerar, compreender e manipular linguagem natural."
    },
    {
        term: "Prompt",
        definition: "Instrução ou entrada de texto fornecida a um modelo de IA para orientar a sua resposta ou comportamento."
    },
    {
        term: "Tokens",
        definition: "Unidades básicas de texto (palavras, caracteres ou subpalavras) que um modelo de linguagem processa e gera."
    },
    {
        term: "Training Data",
        definition: "Conjunto de dados usado para treinar um modelo de machine learning, contendo exemplos de entrada e saída esperada."
    },
    {
        term: "Janela de Contexto",
        definition: "Limite máximo de tokens que um modelo de linguagem pode processar numa única interação ou conversa."
    },
    {
        term: "Temperatura",
        definition: "Parâmetro que controla a aleatoriedade na geração de texto - valores baixos produzem respostas mais determinísticas, valores altos mais criativas."
    },
    {
        term: "Alucinações",
        definition: "Fenómeno onde modelos de IA geram informações incorretas, inventadas ou não baseadas nos dados de treino."
    },
    {
        term: "Engenharia de Prompt",
        definition: "Prática de projectar e optimizar prompts para obter melhores resultados de modelos de linguagem."
    },
    {
        term: "Multimodal",
        definition: "Capacidade de um sistema de IA processar e integrar múltiplos tipos de dados (texto, imagem, áudio, vídeo) simultaneamente."
    },
    {
        term: "Agente",
        definition: "Sistema autónomo de IA que pode perceber o seu ambiente, tomar decisões e executar acções para atingir objectivos específicos."
    },
    {
        term: "RAG (Retrieval-Augmented Generation)",
        definition: "Técnica que combina recuperação de informações com geração de texto, permitindo que modelos acedam a dados externos para respostas mais precisas."
    },
    {
        term: "Redes Neurais",
        definition: "Sistema computacional inspirado no cérebro humano, composto por neurónios artificiais interconectados que processam informações."
    },
    {
        term: "Overfitting",
        definition: "Problema onde um modelo de machine learning se ajusta demais aos dados de treino, perdendo capacidade de generalização."
    },
    {
        term: "Fine-tuning",
        definition: "Processo de ajustar um modelo pré-treinado em dados específicos de uma tarefa para melhorar o seu desempenho."
    },
    {
        term: "API (Application Programming Interface)",
        definition: "Conjunto de protocolos e ferramentas que permite que diferentes aplicações de software se comuniquem entre si."
    }
];

class AIGame {
    constructor() {
        this.currentTermIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.gameStarted = false;
        this.currentCorrectAnswer = null;
        this.usedTerms = new Set();
        
        this.initializeElements();
        this.setupEventListeners();
        this.startNewGame();
    }

    initializeElements() {
        this.currentTermElement = document.getElementById('current-term');
        this.optionsContainer = document.getElementById('options-container');
        this.feedbackElement = document.getElementById('feedback');
        this.scoreElement = document.getElementById('score');
        this.streakElement = document.getElementById('streak');
        this.nextBtn = document.getElementById('next-btn');
        this.restartBtn = document.getElementById('restart-btn');
        this.playAgainBtn = document.getElementById('play-again-btn');
        this.gameOverElement = document.getElementById('game-over');
        this.finalScoreElement = document.getElementById('final-score');
        this.maxStreakElement = document.getElementById('max-streak');
        this.progressElement = document.getElementById('progress');
    }

    setupEventListeners() {
        this.nextBtn.addEventListener('click', () => this.nextTerm());
        this.restartBtn.addEventListener('click', () => this.restartGame());
        this.playAgainBtn.addEventListener('click', () => this.restartGame());
    }

    startNewGame() {
        this.currentTermIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.maxStreak = 0;
        this.gameStarted = true;
        this.usedTerms.clear();
        this.gameOverElement.style.display = 'none';
        
        this.updateScore();
        this.loadRandomTerm();
    }

    loadRandomTerm() {
        // Selecionar um termo aleatório que ainda não foi usado
        const availableTerms = termsDatabase.filter(term => !this.usedTerms.has(term.term));
        
        if (availableTerms.length === 0) {
            this.endGame();
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableTerms.length);
        const selectedTerm = availableTerms[randomIndex];
        
        this.usedTerms.add(selectedTerm.term);
        this.currentCorrectAnswer = selectedTerm.definition;
        
        this.displayTerm(selectedTerm.term);
        this.generateOptions(selectedTerm);
        this.updateProgress();
    }

    displayTerm(term) {
        this.currentTermElement.textContent = term;
    }

    generateOptions(correctTerm) {
        // Criar opções: 1 correta + 3 incorretas
        const options = [correctTerm.definition];
        
        // Selecionar 3 definições aleatórias de outros termos
        const otherTerms = termsDatabase.filter(term => term.term !== correctTerm.term);
        const shuffledOthers = otherTerms.sort(() => 0.5 - Math.random()).slice(0, 3);
        
        shuffledOthers.forEach(term => {
            options.push(term.definition);
        });
        
        // Embaralhar as opções
        const shuffledOptions = options.sort(() => 0.5 - Math.random());
        
        this.displayOptions(shuffledOptions);
    }

    displayOptions(options) {
        this.optionsContainer.innerHTML = '';
        
        options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            optionElement.textContent = option;
            optionElement.addEventListener('click', () => this.selectOption(optionElement, option));
            this.optionsContainer.appendChild(optionElement);
        });
    }

    selectOption(optionElement, selectedDefinition) {
        if (!this.gameStarted) return;
        
        // Desabilitar todas as opções
        const allOptions = this.optionsContainer.querySelectorAll('.option');
        allOptions.forEach(option => {
            option.classList.add('disabled');
            option.style.pointerEvents = 'none';
        });
        
        // Marcar a opção selecionada
        optionElement.classList.add('selected');
        
        // Verificar se está correta
        const isCorrect = selectedDefinition === this.currentCorrectAnswer;
        
        if (isCorrect) {
            optionElement.classList.add('correct');
            this.score += 10;
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
            this.showFeedback('🎉 Correcto!', 'correct');
        } else {
            optionElement.classList.add('incorrect');
            this.streak = 0;
            this.showFeedback('❌ Incorreto! A resposta correcta era: ' + this.currentCorrectAnswer, 'incorrect');
            
            // Destacar a resposta correcta
            allOptions.forEach(option => {
                if (option.textContent === this.currentCorrectAnswer) {
                    option.classList.add('correct');
                }
            });
        }
        
        this.updateScore();
        this.nextBtn.disabled = false;
    }

    showFeedback(message, type) {
        this.feedbackElement.textContent = message;
        this.feedbackElement.className = `feedback ${type}`;
    }

    nextTerm() {
        this.nextBtn.disabled = true;
        this.feedbackElement.textContent = '';
        this.feedbackElement.className = 'feedback';
        this.loadRandomTerm();
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        this.streakElement.textContent = this.streak;
    }

    updateProgress() {
        const progress = (this.usedTerms.size / termsDatabase.length) * 100;
        this.progressElement.style.width = `${progress}%`;
    }

    endGame() {
        this.gameStarted = false;
        this.finalScoreElement.textContent = this.score;
        this.maxStreakElement.textContent = this.maxStreak;
        
        // Calcular percentagem de acertos
        const totalQuestions = termsDatabase.length;
        const correctAnswers = this.score / 10; // 10 pontos por acerto
        const percentage = Math.round((correctAnswers / totalQuestions) * 100);
        
        // Ajustar mensagem baseada no desempenho
        this.updateGameOverMessage(percentage, correctAnswers, totalQuestions);
        
        this.gameOverElement.style.display = 'block';
    }

    updateGameOverMessage(percentage, correctAnswers, totalQuestions) {
        const gameOverTitle = this.gameOverElement.querySelector('h2');
        const gameOverMessage = this.gameOverElement.querySelector('p');
        
        // Remover classes anteriores
        gameOverTitle.className = '';
        
        if (percentage >= 90) {
            gameOverTitle.textContent = '🎉 Excelente!';
            gameOverTitle.classList.add('excellent');
            gameOverMessage.textContent = `Parabéns! Acertou ${correctAnswers} de ${totalQuestions} termos (${percentage}%)!`;
        } else if (percentage >= 70) {
            gameOverTitle.textContent = '👍 Bom trabalho!';
            gameOverTitle.classList.add('good');
            gameOverMessage.textContent = `Bem feito! Acertou ${correctAnswers} de ${totalQuestions} termos (${percentage}%).`;
        } else if (percentage >= 50) {
            gameOverTitle.textContent = '📚 Continue a estudar!';
            gameOverTitle.classList.add('study');
            gameOverMessage.textContent = `Acertou ${correctAnswers} de ${totalQuestions} termos (${percentage}%). Há espaço para melhorar!`;
        } else if (percentage >= 30) {
            gameOverTitle.textContent = '💪 Não desista!';
            gameOverTitle.classList.add('poor');
            gameOverMessage.textContent = `Acertou ${correctAnswers} de ${totalQuestions} termos (${percentage}%). Estude mais os conceitos de IA!`;
        } else {
            gameOverTitle.textContent = '📖 Precisa estudar mais!';
            gameOverTitle.classList.add('very-poor');
            gameOverMessage.textContent = `Apenas ${correctAnswers} de ${totalQuestions} termos correctos (${percentage}%). Revise os conceitos básicos de IA!`;
        }
    }

    restartGame() {
        this.startNewGame();
    }
}

// Inicializar o jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new AIGame();
});
