class Element {
    constructor() {
        this.idx = 0;           // index node
        this.visited = [];      // node yang sudah dikunjungi
        this.weightVisited = 0; // bobot jarak yg sudah dilewati (sama seperti g(n))
        this.weight = 0;        // bobot node (sama seperti g(n) + h(n))
    }

    constructor(index, list, wV, w) {
        this.idx = index;
        this.visited = list;
        this.weightVisited = wV;
        this.weight = w;
    }

    setIdx(index) {
        this.idx = index;
    }

    getIdx() {
        return this.idx;
    }

    addNode(index) {
        this.visited.push(index);
    }

    gethasVisited() {
        return this.visited;
    }

    getWeightVisited() {
        return this.weightVisited;
    }

    getWeight() {
        return this.weight;
    }
}
class PriorityQueue {

    constructor() {
        this.list = [];         // isi queue
        this.hasVisited = [];   // isi node2 yang sudah dikunjungi (unik)
    }

    isEmpty() {
        return this.list.length == 0;
    }

    enqueue(element) {
        // Kosong
        if (isEmpty()) {
            this.list.push(element);
        }

        // Element belum ada di hasVisited; element baru dikunjungi
        else if (this.hasVisited.findIndex(element.getIdx()) != -1){
            // Tampung ke array baru
            let newList = [];
            let isPushed = false;
            let i = 0
            // Selama element baru blm dipush, masukin semua element lama dulu
            while (!isPushed) {
                // Element lama bobotnya lebih ringan
                if (this.list[i].getWeight() <= element.getWeight()) {
                    newList.push(this.list[i]);
                    i++;
                }
                // Element baru di akhir array
                else {
                    isPushed = true;
                    newList.push(element);
                }
            }
            // Push sisa array
            while (i < this.list.length) {
                newList.push(this.list[i]);
            }
            // Assign ke atribut
            this.list = newList;
        }

        // Tambah hasVisited
        this.hasVisited.push(element.getIdx());
    }

    dequeue(element) {
        if (!isEmpty()) {
            return this.list.shift(element)
        }
    }

    peek() {
        if (!isEmpty()) {
            return this.list[0];
        }
    }
}

function haversineDistance(long1, lat1, long2, lat2) {
    // Diambil dari https://www.movable-type.co.uk/scripts/latlong.html
    const r = 6317 // radius bumi 6317 km
    const sigma1 = lat1 * Math.PI/180;
    const sigma2 = lat2 * Math.PI/180;
    const deltasigma = (lat2 - lat1) * Math.PI/180;
    const deltalambda = (long1 - long2) * Math.PI/180

    const a = Math.sin(deltasigma/2) * Math.sin(deltasigma/2) + Math.cos(sigma1) * Math.cos(sigma2) * Math.sin(deltalambda/2) * Math.sin(deltalambda/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return r * c;
}


// Algoritma A*

// Inisialisasi elemen pertama dan queue
function aStar(idxsrc, idxdes, matrix, long, lat) {
    // Kamus
    // idxsrc   : indeks start node
    // idxdes   : indeks destination node
    // matrix   : adjacency matrix
    // long     : list of longitudes
    // lat      : list of lattitudes

    var el = new Element(idxsrc, [], 0, 0);
    var queue = new PriorityQueue();
    queue.enqueue(el);

    // Pengulangan sampai top of queue adalah node tujuan atau queue kosong
    while (el.getIdx() != idxdes && !queue.isEmpty()) {
        el = queue.dequeue();

        // Mencari adjacency di matrix
        for (let kolom = 0; kolom < matrix[el.getIdx()].length; kolom++) {
            if (matrix[el.getIdx()][kolom] == 1) {
                let distanceElNextEl = haversineDistance(long[el.getIdx()], lat[el.getIdx()], long[kolom], lat[kolom]); // hitung jarak pindah elemen
                let heuristicDistance = haversineDistance(long[indexTujuan], lat[indexTujuan], long[kolom], lat[kolom]); // hitung jarak heuristik nextEl ke tujuan
                let newWeightVisited = el.getWeightVisited() + distanceElNextEl; // jarak baru (g(n))
                let newWeight = newWeightVisited + heuristicDistance; // bobot baru (g(n) + h(n))
                let nextEl = new Element(kolom, el.gethasVisited(), newWeightVisited, newWeight) // bikin next element
                nextEl.addNode(el.getIdx()); // nambah node yg udah dikunjungi
                queue.enqueue(nextEl); // enqueue
            }
        }

        // Next element
        el = queue.peek();
    }

    // Isi el.visited dengan diri sendiri
    el.addNode(el.getIdx());

    // Kondisi ketemu
    if (el.getIdx() === idxdes) {
        return el;
    }

    // Kondisi gaketemu : dummy element dgn indeks -1
    else {
        return new Element(-1, [], 0, 0);
    }
}