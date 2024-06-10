import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
} from "chart.js";
import { Bar, Line, Pie} from "react-chartjs-2";
import { faker } from "@faker-js/faker";
import { Grid } from "@mui/material";
// import withAuth from "../../components/PrivateRoute/withAuth";
import styles from "./dashboard.module.scss";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  BarElement,
  ArcElement
);


export const optionsArea = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Lucro",
    },
  },
};

 const labelsArea = [
  "Janeiro",	
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const dataArea = {
  labels: labelsArea,
  datasets: [
    {
      fill: true,
      label: "Lucro",
      data: labelsArea.map(() =>  faker.datatype.float({ min: 0.0, max: 1000.0 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const optionsBar = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Vendas por mês",
    },
  },
};

const labelsBar = [
  "Janeiro",	
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const dataBar = {
  labels: labelsBar,
  datasets: [
    {
      label: "Vendas",
      data: labelsBar.map(() => faker.datatype.number({ min: 0, max: 50 })),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    // {
    //   label: "Dataset 2",
    //   data: labelsBar.map(() => faker.datatype.number({ min: 500, max: 1000 })),
    //   backgroundColor: "rgba(53, 162, 235, 0.5)",
    // },
  ],
};

export const optionsBar1 = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Vendas por funcionário",
    },
  },
};

const labelsBar1 = [
  "Janeiro",	
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export const dataBar1 = {
  labels: labelsBar1,
  datasets: [
    {
      label: "Othon",
      data: labelsBar1.map(() => faker.datatype.number({ min: 0, max: 20 })),
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Rodrigo",
      data: labelsBar.map(() => faker.datatype.number({ min: 0, max: 20 })),
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

export const optionsPie = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Produtos mais vendidos",
    },
  },
};

export const dataPie = {
  labels: ['Prod1', 'Prod2', 'Prod3', 'Prod4', 'Prod5', 'Prod6'],
  datasets: [
    {
      label: '# of Votes',
      data: [12, 19, 3, 5, 2, 3],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};
 

function Dashboard() {
  console.log(dataArea);
  console.log(dataBar);
  return (
    <div className="box list">
      <h1>Dashboard</h1>
      <div className={styles.dashboard}>
        <Grid container columnSpacing={5} rowGap={5} paddingX={3}>
          <Grid item xs={6}>
            <Line options={optionsArea} data={dataArea} />
          </Grid>
          <Grid item xs={6}>
            <Bar options={optionsBar} data={dataBar} />
          </Grid>
          <Grid item xs={6}>
            <Bar options={optionsBar1} data={dataBar1} />
          </Grid>
          <Grid item xs={6}>
          <Pie options={optionsPie} data={dataPie} />
          </Grid>
          <Grid item xs={3}></Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Dashboard;
