namespace BolaoApi.Services;

public static class ScoringService
{
    public static int CalculatePoints(int palpiteA, int palpiteB, int realA, int realB)
    {
        // Placar em cheio
        if (palpiteA == realA && palpiteB == realB)
        {
            return 5;
        }

        // Desfecho correto (Math.Sign(palpiteA - palpiteB) == Math.Sign(realA - realB))
        if (Math.Sign(palpiteA - palpiteB) == Math.Sign(realA - realB))
        {
            return 2;
        }

        return 0;
    }
}
