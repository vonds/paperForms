const deleteQ = document.getElementsByClassName('delete-question')
console.log("delete q")
Array.from(deleteQ).forEach(function (element) {
    element.addEventListener('click', function () {
        const question = this.getAttribute('data-question')
        console.log(this.dataset.question)
        console.log(this.getAttribute('data-question'))
        fetch('questions', {
            method: 'delete',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                'question': question
            })
        }).then(function (response) {
            window.location.reload()
        })
    });
});

