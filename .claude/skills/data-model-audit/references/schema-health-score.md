# Schema Health Score

Score = 100 - penalidades, ponderado pelo volume de properties customizadas do objeto.
- Orfa (sem uso): -2 cada
- Cluster de duplicadas: -5 cada
- Mal nomeada / sem descricao: -1 cada
- Tipo inadequado: -3 cada

Classificacao: 90-100 Saudavel | 70-89 Atencao | 50-69 Inflado | <50 Critico (reporting nao confiavel).
Reporte por objeto e consolidado.
