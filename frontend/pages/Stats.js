export default {
    template: `
    <div class="container mt-5">
        <h2 class="text-center mb-4">Stats Dashboard</h2>
        <div class="row">
            <!-- First Chart -->
            <div class="col-md-6">
                <canvas id="userRoleChart"></canvas>
            </div>
            <!-- Second Chart -->
            <div class="col-md-6">
                <canvas id="serviceRequestsChart"></canvas>
            </div>
        </div>
    </div>
    `,
    mounted() {
        this.renderUserRoleChart();
        this.renderServiceRequestsChart();
    },
    methods: {
        async renderUserRoleChart() {
            const ctx = document.getElementById('userRoleChart').getContext('2d');

            // Example: Fetch data for the chart
            const data = await fetch('/api/stats/user-roles').then(res => res.json());

            new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: Object.keys(data), // Example: ['Admin', 'Customer', 'Service Provider']
                    datasets: [{
                        label: 'User Roles',
                        data: Object.values(data), // Example: [5, 20, 10]
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                        ],
                        borderWidth: 1,
                    }],
                },
            });
        },
        async renderServiceRequestsChart() {
            const ctx = document.getElementById('serviceRequestsChart').getContext('2d');

            // Example: Fetch data for the chart
            const data = await fetch('/api/stats/service-requests').then(res => res.json());

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: Object.keys(data), // Example: ['Pending', 'Accepted', 'Paid']
                    datasets: [{
                        label: '# of Service Requests',
                        data: Object.values(data), // Example: [10, 15, 5]
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        borderColor: 'rgba(153, 102, 255, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                        },
                    },
                },
            });
        },
    },
};