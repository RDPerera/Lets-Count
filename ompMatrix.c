// matrix multipilication using openmp c

#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <omp.h>

#define N 1600
#define CHUNKSIZE 100
float mat1[N][N], mat2[N][N], res[N][N];

int main(int argc, char *argv[])
{
    int i, j, k, tid;
    int chunk = CHUNKSIZE;
    struct timeval start, stop;

    printf("Matrix multiplication using openmp\n");

    // initialize matrices
    for (i = 0; i < N; i++)
    {
        for (j = 0; j < N; j++)
        {
            float rand1 = (rand() % 100) / 2.0;
            // printf("rand1: %d", rand1);
            mat1[i][j] = rand1;
            mat2[i][j] = (rand1) / 2.0;
            res[i][j] = 0;
        }
    }

    // start timer
    gettimeofday(&start, 0);

// multiply matrices
#pragma omp parallel shared(mat1, mat2, res) private(i, j, k, tid)
    {
        tid = omp_get_thread_num();
        printf("Hello World from thread = %d\n", tid);
#pragma omp for schedule(dynamic, chunk) nowait
        for (i = 0; i < N; i++)
        {
            // if (i % 500 == 0)
            // {
            //     printf(" i: %d\n", i);
            // }
            for (j = 0; j < N; j++)
            {
                // if (j % 500 == 0)
                // {
                //     printf(" j: %d", j);
                // }
                for (k = 0; k < N; k++)
                {
                    res[i][j] += mat1[i][k] * mat2[k][j];
                }
            }
        }
    }

    // stop timer
    gettimeofday(&stop, 0);
    printf("Time spent = %.6f\n\n", (stop.tv_sec + stop.tv_usec * 1e-6) - (start.tv_sec + start.tv_usec * 1e-6));

    return 0;
}
